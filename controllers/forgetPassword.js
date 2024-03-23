const path = require('path');
const sgMail = require('@sendgrid/mail');

const forgetPasswordPage = path.join(__dirname,'../views/forgetPassword.html');

exports.getforgetPasswordPage = (req,res)=>{
    res.sendFile(forgetPasswordPage);
}

exports.getEmailToSendResetLink = (req,res)=>{
    const {email} = req.body;
    console.log(email);

    console.log(process.env.FROM_ADDRESS)

    sgMail.setApiKey(process.env.SENGRID_API_KEY )

    const msg = {
        to: 'daminisk272@gmail.com',
        from: 'kesharkardamini1234@gmail.com', 
        subject: 'Subject of your email',
        text: 'Plain text version of your message',
        html: '<p>HTML version of your message</p>',
      };
      
      sgMail.send(msg)
        .then(() => console.log('Email sent successfully'))
        .catch(error => console.error(error.toString()));
}
