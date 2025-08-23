var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");
const uploadfile = require("../middlewares/uploadFile");
const path = require("path");

// --- Routes GET ---
router.get("/getAllUsers", userController.getAllUsers);
router.get("/getOrderUsersByAge", userController.getOrderUsersByAge);
router.get("/searchUsersByUsername", userController.searchUsersByName);
router.get("/getUserByAgeBetweenXAndY", userController.getUserByAgeBetweenXAndY);
router.get("/getUserByAge/:age", userController.getUserByAge);
router.get("/getUserById/:id", userController.getUserById);

// Route pour télécharger un CV
router.get("/downloadCV/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, '../uploads/cvs', filename);
    
    // Vérifier si le fichier existe
    if (!require('fs').existsSync(filepath)) {
      return res.status(404).json({ message: "CV non trouvé" });
    }
    
    // Télécharger le fichier
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({ message: "Erreur lors du téléchargement du CV" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Routes POST ---

// Nouvelle route pour ajouter un utilisateur avec sélection de rôle
router.post("/addUserWithRole", userController.addUserWithRole);

// Add Users by role (routes existantes)
router.post("/addStudent", userController.addStudent);
router.post("/addTeacher", userController.addTeacher);
router.post("/addAdmin", userController.addAdmin);

// Upload student with file
router.post(
  "/addStudentWithFile",
  uploadfile.single("image_User"),
  userController.addStudentWithFile
);

// --- Routes DELETE ---
router.delete("/DeleteUserById/:id", userController.DeleteUserById);

module.exports = router;