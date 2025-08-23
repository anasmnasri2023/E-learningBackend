const userModel = require("../models/userModel");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const PDFDocument = require('pdfkit'); // npm install pdfkit

// --- helper pour supprimer un fichier uploadé ---
async function cleanupUploadedFile(file) {
  try {
    if (!file) return;
    const fullPath = file.path || path.join(file.destination, file.filename);
    await fsp.unlink(fullPath);
    console.log("[CLEANUP] Fichier supprimé :", fullPath);
  } catch (e) {
    if (e.code !== "ENOENT") {
      console.error("[CLEANUP] Échec suppression fichier :", e.message);
    }
  }
}

// --- Helper pour générer un CV PDF ---
async function generateUserCV(userData) {
  try {
    // Créer le dossier uploads/cvs s'il n'existe pas
    const cvDir = path.join(__dirname, '../uploads/cvs');
    if (!fs.existsSync(cvDir)) {
      fs.mkdirSync(cvDir, { recursive: true });
    }

    // Nom du fichier PDF
    const filename = `cv_${userData.username}_${Date.now()}.pdf`;
    const filepath = path.join(cvDir, filename);

    // Créer le document PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // Header du CV
    doc.fontSize(20).text('E-LEARNING LANGUAGE PLATFORM SERVICE', { align: 'center' });
    doc.moveDown();

    // Informations personnelles
    doc.fontSize(16).text('INFORMATIONS PERSONNELLES', { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(12);
    doc.text(`Nom d'utilisateur: ${userData.username || 'N/A'}`);
    doc.text(`Email: ${userData.email || 'N/A'}`);
    doc.text(`Âge: ${userData.age || 'N/A'} ans`);
    doc.text(`Rôle: ${userData.role || 'N/A'}`);
    
    // Date de création
    doc.moveDown();
    doc.fontSize(10).text(`CV généré le: ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });

    // Informations supplémentaires selon le rôle
    doc.moveDown();
    doc.fontSize(16).text('PROFIL', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);

    switch(userData.role) {
      case 'student':
        doc.text('Profil: Étudiant motivé cherchant à acquérir de nouvelles compétences et expériences.');
        break;
      case 'teacher':
        doc.text('Profil: Enseignant expérimenté dédié à la transmission des connaissances.');
        break;
      case 'admin':
        doc.text('Profil: Administrateur système avec expertise en gestion et coordination.');
        break;
      default:
        doc.text('Profil: Utilisateur de la plateforme.');
    }

    // Section compétences (exemple)
    doc.moveDown();
    doc.fontSize(16).text('COMPÉTENCES', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text('• Communication');
    doc.text('• Travail en équipe');
    doc.text('• Adaptabilité');

    // Finaliser le PDF
    doc.end();

    // Attendre que le fichier soit complètement écrit
    await new Promise((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    return filename; // Retourner juste le nom du fichier
  } catch (error) {
    console.error('Erreur lors de la génération du CV:', error);
    throw error;
  }
}

// --- GET tous les users ---
module.exports.getAllUsers = async (req, res) => {
  try {
    const UserList = await userModel.find();
    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GET users triés par âge ---
module.exports.getOrderUsersByAge = async (req, res) => {
  try {
    const UserList = await userModel.find().sort({ age: 1 }).limit(4);
    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GET users par âge ---
module.exports.getUserByAge = async (req, res) => {
  try {
    const age = req.params.age;
    const UserList = await userModel.find({ age: age });
    if (UserList.length === 0) {
      throw new Error("User not Found !");
    }
    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GET users entre deux âges ---
module.exports.getUserByAgeBetweenXAndY = async (req, res) => {
  try {
    const { minAge, maxAge } = req.body;
    if (isNaN(minAge) || isNaN(maxAge)) {
      throw new Error("Ages invalides !");
    }
    if (minAge > maxAge) {
      throw new Error("minAge doit être <= maxAge !");
    }
    const UserList = await userModel
      .find({ age: { $gte: minAge, $lte: maxAge } })
      .sort({ age: 1 });

    if (UserList.length === 0) {
      throw new Error("User not Found !");
    }
    res.status(200).json({ UserList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GET user par ID ---
module.exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const User = await userModel.findById(id);
    if (!User) throw new Error("User not found");
    res.status(200).json({ User });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST user avec sélection de rôle et génération CV automatique ---
module.exports.addUserWithRole = async (req, res) => {
  try {
    const { username, email, password, age, role } = req.body;

    // Validation du rôle
    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      throw new Error("Rôle invalide. Les rôles autorisés sont: student, teacher, admin");
    }

    // Créer l'objet utilisateur
    const userData = {
      username,
      email,
      password,
      age,
      role
    };

    // Générer le CV PDF automatiquement
    const cvFilename = await generateUserCV(userData);
    userData.cv_User = cvFilename;

    // Créer et sauvegarder l'utilisateur
    const user = new userModel(userData);
    const addedUser = await user.save();

    res.status(201).json({
      message: `${role} créé avec succès et CV généré automatiquement`,
      user: addedUser,
      cvPath: `/uploads/cvs/${cvFilename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST student avec génération CV automatique ---
module.exports.addStudent = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    
    // Créer l'objet utilisateur
    const userData = {
      username,
      email,
      password,
      age,
      role: "student"
    };

    // Générer le CV PDF automatiquement
    const cvFilename = await generateUserCV(userData);
    userData.cv_User = cvFilename;

    // Créer et sauvegarder l'utilisateur
    const student = new userModel(userData);
    const addedUser = await student.save();

    res.status(201).json({
      message: "Student créé avec succès et CV généré automatiquement",
      user: addedUser,
      cvPath: `/uploads/cvs/${cvFilename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST teacher avec génération CV automatique ---
module.exports.addTeacher = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    
    // Créer l'objet utilisateur
    const userData = {
      username,
      email,
      password,
      age,
      role: "teacher"
    };

    // Générer le CV PDF automatiquement
    const cvFilename = await generateUserCV(userData);
    userData.cv_User = cvFilename;

    // Créer et sauvegarder l'utilisateur
    const teacher = new userModel(userData);
    const addedUser = await teacher.save();

    res.status(201).json({
      message: "Teacher créé avec succès et CV généré automatiquement",
      user: addedUser,
      cvPath: `/uploads/cvs/${cvFilename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST admin avec génération CV automatique ---
module.exports.addAdmin = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    
    // Créer l'objet utilisateur
    const userData = {
      username,
      email,
      password,
      age,
      role: "admin"
    };

    // Générer le CV PDF automatiquement
    const cvFilename = await generateUserCV(userData);
    userData.cv_User = cvFilename;

    // Créer et sauvegarder l'utilisateur
    const admin = new userModel(userData);
    const addedUser = await admin.save();

    res.status(201).json({
      message: "Admin créé avec succès et CV généré automatiquement",
      user: addedUser,
      cvPath: `/uploads/cvs/${cvFilename}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST student avec fichier uploadé et génération CV automatique ---
module.exports.addStudentWithFile = async (req, res) => {
  try {
    const userData = { ...req.body };
    userData.role = "student";

    if (req.file) {
      const { filename } = req.file;
      userData.image_User = filename;
    }

    // Générer le CV PDF automatiquement
    const cvFilename = await generateUserCV(userData);
    userData.cv_User = cvFilename;

    // Créer et sauvegarder l'utilisateur
    const student = new userModel(userData);
    const addedUser = await student.save();

    return res.status(201).json({
      message: "Student avec fichier créé avec succès et CV généré automatiquement",
      user: addedUser,
      cvPath: `/uploads/cvs/${cvFilename}`
    });
  } catch (error) {
    await cleanupUploadedFile(req.file);
    return res.status(500).json({ message: error.message });
  }
};

// --- DELETE user par ID ---
module.exports.DeleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const checkIfUserExists = await userModel.findById(id);
    if (!checkIfUserExists) {
      throw new Error("User not Found !");
    }
    await userModel.findByIdAndDelete(id);
    res.status(200).json("deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- POST recherche user par nom ---
module.exports.searchUsersByName = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      throw new Error("Please select a name");
    }

    const userList = await userModel.find({
      username: { $regex: username, $options: "i" },
    });

    if (userList.length === 0) {
      throw new Error("Aucun utilisateur trouvé pour ce nom");
    }
    res.status(200).json({ userList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};