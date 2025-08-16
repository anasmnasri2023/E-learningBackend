const userModel = require("../models/userModel");

module.exports.getData = async ()=>{
    try {
           const UserList = await userModel.find()

        return UserList;
    } catch (error) {
    throw new Error('Erreur lors de la récupération des osInformation');
    }
}