const path = require('path');
const nodemailer = require("nodemailer");

const forgetPasswordPage = path.join(__dirname,'../views/forgetPassword.html');

exports.getforgetPasswordPage = (req,res)=>{
    res.sendFile(forgetPasswordPage);
}

exports.getEmailToSendResetLink = async (req,res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'haskell.bernhard88@ethereal.email',
            pass: 'evffJqA3Sc8crX1xMu'
        }
    });

    let info = await transporter.sendMail({
        from: '"Damini 👻" <haskell.bernhard88@ethereal.email>', // sender address
        to: "daminisk272@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      });
    
      console.log("Message sent: %s", info.messageId);
}
