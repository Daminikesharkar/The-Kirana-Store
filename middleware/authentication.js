const jwt = require('jsonwebtoken');
const Users = require('../models/users');

exports.authenticate = async(req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const parsedToken = jwt.verify(token,process.env.SECRETKEY);

        const user = await Users.findByPk(parsedToken.userId); 
        if (user) {
            req.user = user;
            next();
        } else {
            response.status(404).json({ error: 'User not found' });
        }
          
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error - please login again' });
    }
}