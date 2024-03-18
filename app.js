const express = require('express');
const path = require('path');

const homePageRoutes = require('./routes/home');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

app.use(homePageRoutes);

app.listen(3000, ()=>{
    console.log('Server is live on port 3000');
})