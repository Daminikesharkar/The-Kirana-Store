const path = require('path');
const kiranaProducts = require('../models/kiranaProducts');

const userStorePagePath = path.join(__dirname,'../views/userStore.html');

exports.displayUserStorePage = (req,res)=>{
    res.sendFile(userStorePagePath);
}

exports.addProducts = async (req,res)=>{
    const {item,quantity,category,price} = req.body;

    try {
        const newProduct = await kiranaProducts.create({
            item:item,
            quantity:quantity,
            category:category,
            price:price
        })
        console.log(newProduct);

        return res.status(200).json({
            message: 'Product added successfully',
            product: newProduct
        });
        
    } catch (error) {
        res.status(500).json({error: 'Error adding product'});
    }
}