class EmailTemplates {
  
  // Template pour la réinitialisation de mot de passe
  static passwordResetTemplate(username, resetUrl) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8fafc;
                color: #334155;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                color: #1e293b;
                margin-bottom: 20px;
                font-weight: 500;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #475569;
            }
            .reset-button {
                text-align: center;
                margin: 40px 0;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            .security-info {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
            }
            .security-info h3 {
                color: #92400e;
                font-size: 16px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
            }
            .security-info p {
                color: #b45309;
                font-size: 14px;
            }
            .footer {
                background-color: #f1f5f9;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer p {
                color: #64748b;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .social-links {
                margin-top: 20px;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }
            .expiry {
                background-color: #fee2e2;
                color: #dc2626;
                padding: 12px;
                border-radius: 6px;
                text-align: center;
                font-weight: 500;
                margin: 20px 0;
                border: 1px solid #fecaca;
            }
            @media (max-width: 600px) {
                .container {
                    margin: 10px;
                    border-radius: 8px;
                }
                .header, .content, .footer {
                    padding: 20px;
                }
                .btn {
                    padding: 14px 24px;
                    font-size: 15px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Réinitialisation de mot de passe</h1>
                <p>E-Learning Language Platform</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Bonjour ${username} 👋
                </div>
                
                <div class="message">
                    Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte sur notre plateforme d'apprentissage des langues.
                </div>
                
                <div class="reset-button">
                    <a href="${resetUrl}" class="btn">
                        🔄 Réinitialiser mon mot de passe
                    </a>
                </div>
                
                <div class="expiry">
                    ⏰ Ce lien expire dans 10 minutes pour votre sécurité
                </div>
                
                <div class="security-info">
                    <h3>🛡️ Informations de sécurité</h3>
                    <p>
                        • Si vous n'avez pas demandé cette réinitialisation, ignorez cet email<br>
                        • Votre mot de passe actuel reste inchangé jusqu'à ce que vous en créiez un nouveau<br>
                        • Utilisez un mot de passe fort avec au moins 8 caractères
                    </p>
                </div>
                
                <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
                    Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :<br>
                    <span style="color: #667eea; word-break: break-all;">${resetUrl}</span>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>E-Learning Language Platform</strong></p>
                <p>Votre partenaire dans l'apprentissage des langues</p>
                <div class="social-links">
                    <a href="#">📧 Support</a>
                    <a href="#">🌐 Site Web</a>
                    <a href="#">📱 Application</a>
                </div>
                <p style="margin-top: 20px; font-size: 12px;">
                    © ${new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Template de confirmation de réinitialisation
  static passwordResetConfirmationTemplate(username) {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mot de passe modifié</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8fafc;
                color: #334155;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .success-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            .message {
                font-size: 18px;
                margin-bottom: 30px;
                color: #1e293b;
            }
            .footer {
                background-color: #f1f5f9;
                padding: 30px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Mot de passe modifié avec succès</h1>
            </div>
            
            <div class="content">
                <div class="success-icon">🎉</div>
                <h2>Parfait, ${username} !</h2>
                <div class="message">
                    Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </div>
                <p style="color: #64748b;">
                    Si vous n'êtes pas à l'origine de cette modification, contactez-nous immédiatement.
                </p>
            </div>
            
            <div class="footer">
                <p><strong>E-Learning Language Platform</strong></p>
                <p style="color: #64748b; font-size: 14px; margin-top: 10px;">
                    © ${new Date().getFullYear()} E-Learning Platform. Tous droits réservés.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Template de bienvenue
  static welcomeTemplate(username, role) {
    const roleMessages = {
      student: "Commencez votre parcours d'apprentissage dès aujourd'hui !",
      teacher: "Partagez vos connaissances et inspirez vos étudiants !",
      admin: "Gérez la plateforme et accompagnez notre communauté !"
    };

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f8fafc;
                color: #334155;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            .welcome-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }
            .role-badge {
                display: inline-block;
                background-color: #e0e7ff;
                color: #5b21b6;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Bienvenue sur E-Learning Platform !</h1>
            </div>
            
            <div class="content">
                <div class="welcome-icon">🚀</div>
                <h2>Bonjour ${username} !</h2>
                <div class="role-badge">Rôle: ${role.toUpperCase()}</div>
                <p>${roleMessages[role] || "Bienvenue dans notre communauté d'apprentissage !"}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

module.exports = EmailTemplates;