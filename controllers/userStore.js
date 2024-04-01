const path = require('path');
const kiranaProducts = require('../models/kiranaProducts');
const User = require('../models/users');
const sequelize = require('../util/database');

const userStorePagePath = path.join(__dirname,'../views/userStore.html');

exports.displayUserStorePage = (req,res)=>{
    res.sendFile(userStorePagePath);
}

exports.addProducts = async (req,res)=>{
    const {item,quantity,category,price} = req.body;
    const transaction = await sequelize.transaction();

    try {        
        const newProduct = await kiranaProducts.create({
            item:item,
            quantity:quantity,
            category:category,
            price:price,
            userId:req.user.id
        },{transaction})
        const total_spend = Number(req.user.totalspend) + Number(price);
        await User.update({ totalspend: total_spend }, { where: { id: req.user.id }, transaction });
        await transaction.commit();
        return res.status(200).json({
            message: 'Product added successfully',
            product: newProduct
        });     
    
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        res.status(500).json({error: 'Error adding product'});
    }
}

exports.getAllProducts = async (req, res) => {
    const page = +req.query.page || 1;
    // const ITEMS_PER_PAGE = +req.query.itemsPerPage || 2;
    const ITEMS_PER_PAGE = 2;
    console.log(+req.query.itemsPerPage);

    try {
        const totalItems = await kiranaProducts.count({ where: { userId: req.user.id } });
        
        const products = await kiranaProducts.findAll({
            where: { userId: req.user.id },
            offset: (page - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE
        });
        
        return res.status(200).json({
            products: products,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        console.error("Error getting all products:", error);
        res.status(500).json({ error: 'Error getting all products' });
    }
}

exports.deleteProduct = async (req,res)=>{
    const transaction = await sequelize.transaction();
    try {
        const id = req.params.id;        
        const product = await kiranaProducts.findByPk(id);

        const total_spend = Number(req.user.totalspend) - Number(product.price);
        await User.update({totalspend:total_spend},{where:{id:req.user.id}},{transaction});

        await product.destroy();
        await transaction.commit();

        return res.json({ message: 'product deleted successfully' });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({error: 'Error deleting product'});
    }
}