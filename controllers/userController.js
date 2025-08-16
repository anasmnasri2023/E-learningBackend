const userModel = require("../models/userModel");

module.exports.esmFocntion = async (req, res) => {
  try {
    //logique
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    //logique
    const UserList = await userModel.find()

    res.status(200).json({UserList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    //logique
    //const id = req.body
    const id = req.params
    //const id = req.query
    const User = await userModel.findById(id)

    res.status(200).json({User});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addClient = async (req, res) => {
  try {
    //logique
    const {username , email, password , age}=req.body
    console.log("req.body",req.body)
    const role = 'client'
    const client = new userModel({username , email, password , age,role})
    //const client = new userModel(req.body)
    const addedUser = await client.save()
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.addProf = async (req, res) => {
  try {
    //logique
    const {username , email, password , age}=req.body
    console.log("req.body",req.body)
    const role = 'prof'
    const client = new userModel({username , email, password , age,role})
    //const client = new userModel(req.body)
    const addedUser = await client.save()
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};