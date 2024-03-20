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
            price:price,
            userId:req.user.id
        })

        return res.status(200).json({
            message: 'Product added successfully',
            product: newProduct
        });
        
    } catch (error) {
        res.status(500).json({error: 'Error adding product'});
    }
}

exports.getAllProducts = async (req,res)=>{
    try {
        const products = await kiranaProducts.findAll({where: {
            userId: req.user.id,
        }});

        return res.status(200).json({
            products: products
        })

    } catch (error) {
        res.status(500).json({error: 'Error getting all products'});
    }
}

exports.deleteProduct = async (req,res)=>{
    try {
        const id = req.params.id;
        const product = await kiranaProducts.findByPk(id);
        await product.destroy();

        return res.json({ message: 'product deleted successfully' });
    } catch (error) {
        res.status(500).json({error: 'Error deleting product'});
    }
}