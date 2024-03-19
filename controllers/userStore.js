const path = require('path');

const userStorePagePath = path.join(__dirname,'../views/userStore.html');

exports.displayUserStorePage = (req,res)=>{
    res.sendFile(userStorePagePath);
}