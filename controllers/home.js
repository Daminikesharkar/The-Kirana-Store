const path = require('path');

const Users = require('../models/users');

const indexPage = path.join(__dirname,'../views/index.html');

//displaying Home page controller
exports.getIndexPage = (req,res)=>{
    res.sendFile(indexPage);
}

//signUp controller
exports.postUser = async (req,res)=>{
    const { username, email, password } = req.body;

    try {
        const user = await Users.findOne({where :{email:email}});

        if(user){
            return res.status(400).json({
                message: 'User already exists with this email address'
            });
        }else{
            const newUser = await Users.create({
                username: username,
                email: email,
                password: password 
            })
            
            return res.status(200).json({
                message: 'User added successfully',
                user: newUser
            });
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
}