const nodemailer = require("nodemailer");
const emailTemplates = require("../templates/emailTemplates");

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  // Configuration du transporteur email
  createTransporter() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Méthode générique pour envoyer des emails
  async sendEmail(to, subject, htmlContent) {
    try {
      const mailOptions = {
        from: {
          name: "E-Learning Platform",
          address: process.env.EMAIL_USER,
        },
        to,
        subject,
        html: htmlContent,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email envoyé avec succès à ${to}:`, result.messageId);
      return result;
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de l'email:", error);
      throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
    }
  }

  // Email de réinitialisation de mot de passe
  async sendPasswordResetEmail(userEmail, username, resetUrl) {
    const subject = "🔐 Réinitialisation de votre mot de passe - E-Learning Platform";
    const htmlContent = emailTemplates.passwordResetTemplate(username, resetUrl);
    
    return await this.sendEmail(userEmail, subject, htmlContent);
  }

  // Email de confirmation de réinitialisation
  async sendPasswordResetConfirmation(userEmail, username) {
    const subject = "✅ Mot de passe modifié avec succès - E-Learning Platform";
    const htmlContent = emailTemplates.passwordResetConfirmationTemplate(username);
    
    return await this.sendEmail(userEmail, subject, htmlContent);
  }

  // Email de bienvenue
  async sendWelcomeEmail(userEmail, username, role) {
    const subject = "🎉 Bienvenue sur E-Learning Platform !";
    const htmlContent = emailTemplates.welcomeTemplate(username, role);
    
    return await this.sendEmail(userEmail, subject, htmlContent);
  }

  // Test de la configuration email
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Configuration email valide");
      return true;
    } catch (error) {
      console.error("❌ Configuration email invalide:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
