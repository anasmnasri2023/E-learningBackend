
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const emailService = require("../service/emailService");

class AuthService {
  
  // Connexion utilisateur
  static async login(email, password) {
    try {
      // Recherche de l'utilisateur
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Aucun compte associé à cette adresse email");
      }

      // Vérification du statut du compte
      if (user.isDeleted) {
        throw new Error("Ce compte a été supprimé");
      }
      
      if (user.isBloked) {
        throw new Error("Ce compte est temporairement bloqué. Contactez le support");
      }

      // Vérification du mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Mot de passe incorrect");
      }

      // Mise à jour du statut de connexion
      user.statu = true;
      await user.save();

      console.log(`✅ Connexion réussie pour: ${user.email}`);

      return {
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          age: user.age,
          image_User: user.image_User
        }
      };

    } catch (error) {
      console.error(`❌ Erreur de connexion pour ${email}:`, error.message);
      throw error;
    }
  }

  // Déconnexion utilisateur
  static async logout(userId) {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.statu = false;
        await user.save();
        console.log(`👋 Déconnexion pour: ${user.email}`);
      }
      return { message: "Déconnexion réussie" };
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error.message);
      throw error;
    }
  }

  // Mot de passe oublié
  static async forgotPassword(email) {
    try {
      // Recherche de l'utilisateur
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Aucun compte associé à cette adresse email");
      }

      if (user.isDeleted) {
        throw new Error("Ce compte a été supprimé");
      }

      // Génération du token de réinitialisation
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Sauvegarde du token et de l'expiration (10 minutes)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
      await user.save();

      // URL de réinitialisation
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      // Envoi de l'email avec le nouveau service
      await emailService.sendPasswordResetEmail(
        user.email,
        user.username,
        resetUrl
      );

      console.log(`📧 Email de réinitialisation envoyé à: ${user.email}`);

      return { 
        message: "Email de réinitialisation envoyé avec succès",
        email: user.email 
      };

    } catch (error) {
      console.error(`❌ Erreur mot de passe oublié pour ${email}:`, error.message);
      throw error;
    }
  }

  // Réinitialisation du mot de passe
  static async resetPassword(token, newPassword) {
    try {
      // Validation du mot de passe
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      // Hash du token reçu
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      // Recherche de l'utilisateur avec token valide
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error("Token de réinitialisation invalide ou expiré");
      }

      // Mise à jour du mot de passe
      user.password = newPassword; // Le hashing se fait automatiquement via le middleware pre('save')
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      // Envoi de l'email de confirmation
      await emailService.sendPasswordResetConfirmation(
        user.email,
        user.username
      );

      console.log(`✅ Mot de passe réinitialisé pour: ${user.email}`);

      return { 
        message: "Mot de passe réinitialisé avec succès",
        email: user.email 
      };

    } catch (error) {
      console.error("❌ Erreur réinitialisation mot de passe:", error.message);
      throw error;
    }
  }

  // Vérification du token de réinitialisation
  static async verifyResetToken(token) {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error("Token de réinitialisation invalide ou expiré");
      }

      return { 
        valid: true, 
        email: user.email,
        expiresIn: Math.floor((user.resetPasswordExpires - Date.now()) / 1000) // en secondes
      };

    } catch (error) {
      console.error("❌ Token invalide:", error.message);
      throw error;
    }
  }

  // Changement de mot de passe (utilisateur connecté)
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Vérification du mot de passe actuel
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Mot de passe actuel incorrect");
      }

      // Validation du nouveau mot de passe
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      }

      // Mise à jour
      user.password = newPassword;
      await user.save();

      console.log(`🔐 Mot de passe changé pour: ${user.email}`);

      return { message: "Mot de passe modifié avec succès" };

    } catch (error) {
      console.error("❌ Erreur changement mot de passe:", error.message);
      throw error;
    }
  }
    // Inscription utilisateur
  static async register(username, email, password, role = "user", age) {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Un compte existe déjà avec cet email");
      }

      // Validation basique du mot de passe
      if (!password || password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      // Création utilisateur
      const user = new User({
        username,
        email,
        password, // hash via middleware Mongoose `pre("save")`
        role,
        age,
        statu: false
      });

      await user.save();

      console.log(`✅ Utilisateur créé: ${user.email}`);

      return {
        token: generateToken(user._id),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          age: user.age,
          image_User: user.image_User
        }
      };

    } catch (error) {
      console.error("❌ Erreur inscription:", error.message);
      throw error;
    }
  }

}

module.exports = AuthService;