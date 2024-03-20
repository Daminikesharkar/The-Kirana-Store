const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const kiranaProducts = sequelize.define('kiranaproducts',{
    id:{
        type:Sequelize.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    item:{
        type:Sequelize.STRING,
        allownull:false,
    },
    quantity:{
        type:Sequelize.STRING,
        allownull:false,
    },
    category:{
        type:Sequelize.STRING,
        allownull:false,
    },
    price:{
        type:Sequelize.INTEGER,
        allownull:false,
    }
})

module.exports = kiranaProducts;