const { v4: uuidv4, validate } = require("uuid");
const { Op } = require("sequelize");
const { User } = require("../db.js");




async function getUser(req,res,next){
    const {email}=req.query;
    if (email)
    {
        try {
            const user = await User.findAll({
                where:{
                    email:{[Op.iLike]:`%${email}%`},
                    // password:{[Op.iLike]:`%${password}%`}
                },
            });

            // const nickName=user[0].dataValues;
            user ? res.json(user) : res.send("No existe el usuario");
        } catch (error) {
            res.send(error);
        }
    }
    else
    {   
        const users = await User.findAll();
        users ? res.json(users) : res.send("Users not found");
    }
};


async function addUser(req,res,next){
    const {password,usertype,nickName,firstName,lastName,email,phone,birthdate,country,verify} = req.body;
    try {
        const userCreated = await User.create({
            password,
            usertype,
            nickName,
            firstName,
            lastName,
            email,
            phone,
            birthdate,
            country,
            verify
        });
        res.status(200).send('user created successfully');
    } catch (error) {
        res.status(500).send(error)
    }
    
}

async function delUser(req,res,next){
    const {emailUser}=req.params;
    try {
        const userDeleted = await User.destroy({
            where:{
                email:emailUser
            }
        });
        res.status(200).send('user deleted successfully');
    } catch (error) {
        res.status(500).send(error)
    }
}

async function updateUser(req,res,next){
    const {password,usertype,nickName,firstName,lastName,email,phone,birthdate,country,verify} = req.body;
    try {
        const userUpdated = await User.update({
            password,
            usertype,
            nickName,
            firstName,
            lastName,
            email,
            phone,
            birthdate,
            country,
            verify
        },{
            where:{
                email:email
            }
        });
        res.status(200).send('user updated successfully');
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getUser,
    addUser,
    delUser,
    updateUser
    
};

