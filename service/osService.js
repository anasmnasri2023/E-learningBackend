const os = require('os')

module.exports.getData = async ()=>{
    try {
        const osInformation = {
            hostname : os.hostname(),
            platform : os.platform(),
            type : os.type(),
            release : os.release()
        }
        if(!osInformation){
            throw new Error('osInformation not found');
        }
        console.log(osInformation)
        return osInformation;
    } catch (error) {
    throw new Error('Erreur lors de la récupération des osInformation');
    }
}