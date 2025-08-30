# E-LearningBackend/Dockerfile
FROM node:16.14.2-alpine

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec npm install
RUN npm install

# Copier le reste du code
COPY . .

# Changer la propriété des fichiers vers l'utilisateur nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["npm", "start"]