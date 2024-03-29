const path = require('path');
const premiumPagePath = path.join(__dirname,'../views/premium.html');

exports.displayPremiumPage = (req,res)=>{
    console.log('in')
    res.sendFile(premiumPagePath);
}