const express = require('express');
const path = require('path');

const homePageRoutes = require('./routes/home');
const userStorePageRoutes = require('./routes/userStore');

const User = require('./models/users');
const Products = require('./models/kiranaProducts');

const sequelize = require('./util/database');

const app = express();

app.use(express.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());

app.use(homePageRoutes);
app.use(userStorePageRoutes);

User.hasMany(Products);
Products.belongsTo(User,{constraints:true, onDelete:'CASCADE'});

// sequelize.sync({ alter: true })
sequelize.sync();

app.listen(3000, ()=>{
    console.log('Server is live on port 3000');
})