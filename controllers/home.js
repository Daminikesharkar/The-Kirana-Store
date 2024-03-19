const path = require('path');
const bcrypt = require('bcrypt');

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
            const saltrounds = 10;
            const hashedPassword = await bcrypt.hash(password,10);

            const newUser = await Users.create({
                username: username,
                email: email,
                password: hashedPassword 
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
            const passwordCompare = await bcrypt.compare(password,user.password);
            if(passwordCompare){
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