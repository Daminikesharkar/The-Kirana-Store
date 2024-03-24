const path = require('path');
const nodemailer = require("nodemailer");
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const forgetPassword = require('../models/password');

const forgetPasswordPage = path.join(__dirname,'../views/forgetPassword.html');

exports.getforgetPasswordPage = (req,res)=>{
    res.sendFile(forgetPasswordPage);
}

exports.getEmailToSendResetLink = async (req,res)=>{

    try {
        const {email} = req.body;
        console.log(email)

        const user = await User.findOne({where: {email: email}});

        if(user){
            console.log(user);
            const id = uuid.v4();

            await forgetPassword.create({
                id:id,
                active:true,
                userId:user.id
            })

            // User.createForgotpassword({ id , active: true })
            // .catch(err => {
            //     throw new Error(err)
            // })

            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'haskell.bernhard88@ethereal.email',
                    pass: 'evffJqA3Sc8crX1xMu'
                }
            });
    
            let info = await transporter.sendMail({
                from: '"The Kirana store " <haskell.bernhard88@ethereal.email>',
                to: email, 
                subject: "Reset your password to login back", 
                text: "Please find below link to reset your password and login back",
                html: `<a href="http://localhost:3000/forgetPassword/${id}">Reset password</a>`, 
            });
            
            return res.status(200).json({
                message: 'Link to reset your password sent on your email id',
            });

        }else{
            res.status(500).json({error: 'User does not exists'});
        }   
    } catch (error) {
        res.status(500).json({error: 'Error sending link'});
    }
}

exports.resetPassword = async (req,res)=>{
    try {
        const id =  req.params.id;
        
        const forgetPassRequest = await forgetPassword.findOne({where:{id:id}});
        if(forgetPassRequest){
            await forgetPassRequest.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/updatePassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    } catch (error) {
        res.status(500).json({error: 'Link is expired'});
    }
}

exports.updatePassword = async (req,res)=>{
    console.log("changed");
    try {
        const {newpassword} = req.query;
        const id = req.params.id;

        console.log(newpassword,id);

        const resetPassReq = await forgetPassword.findOne({where:{id:id}});
        if(resetPassReq){
            const user = await User.findOne({where:{id:resetPassReq.userId}});

            if(user){
                const saltrounds = 10;
                const hashedPassword = await bcrypt.hash(newpassword,saltrounds);

                await user.update({password:hashedPassword})
            }
            
            return res.status(200).json({
                message: 'successfully updated the password, Please Login now!',
            });
        }

    } catch (error) {
        res.status(500).json({error: 'Link is expired'});
    }
}