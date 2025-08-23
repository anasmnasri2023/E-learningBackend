const jwt = require("jsonwebtoken");

module.exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(" ")[1];

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey");

      req.user = decoded; // stocker user (id + role)
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, pas de token" });
  }
};
