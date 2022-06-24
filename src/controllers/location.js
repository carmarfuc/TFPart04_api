const { Location } = require("../db.js");

async function getLocations(req, res) {
    try{
        const locations = await Location.findAll()
        res.send(locations)
    }catch(error){res.send(`Error: ${error}`)}
}

module.exports= {
    getLocations
}