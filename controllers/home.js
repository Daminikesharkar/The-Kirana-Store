const path = require('path');

const Users = require('../models/users');
const { where } = require('sequelize');
const { use } = require('../routes/home');

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

//login controller
exports.loginUser = async(req,res)=>{
    const {email,password} = req.body;

    try {        
        const user = await Users.findOne({where:{email:email}})
        if(user){
            if(password === user.password){
                return res.status(200).json({
                    message:"User logged in successfully!",
                    user:user
                })
            }else{
                return res.status(401).json({
                    message: "Password doesn't match, please try again"
                })
            }
        }else{
            return res.status(400).json({
                message: "Email address is not registered please signUp first"
            })
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
}