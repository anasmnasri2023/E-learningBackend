const AuthService = require("../service/authService");

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new Error("Veuillez entrer email et mot de passe");

    const result = await AuthService.login(email, password);

    res.status(200).json({
      message: "Connexion réussie",
      ...result,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const result = await AuthService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.register = async (req, res) => {
  try {
    const { username, email, password, role, age } = req.body;

    if (!username || !email || !password) {
      throw new Error("Veuillez remplir tous les champs obligatoires");
    }

    const result = await AuthService.register(username, email, password, role, age);

    res.status(201).json({
      message: "Inscription réussie",
      ...result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

