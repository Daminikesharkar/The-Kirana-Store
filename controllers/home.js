const path = require('path');

const indexPage = path.join(__dirname,'../views/index.html');


exports.getIndexPage = (req,res)=>{
    res.sendFile(indexPage);
}