const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route Login
router.post("/login", authController.login);

// Mot de passe oublié
router.post("/forgot-password", authController.forgotPassword);

// Réinitialisation du mot de passe
router.post("/reset-password/:token", authController.resetPassword);
// Inscription utilisateur
router.post("/register", authController.register);


module.exports = router;
