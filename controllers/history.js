const path = require('path');
const AWS = require('aws-sdk');
const { Op } = require('sequelize');

const historyPagePath = path.join(__dirname,'../views/history.html');
const kiranaProducts = require('../models/kiranaProducts');
const downloads = require('../models/download');

exports.displayHistoryPage = (req,res)=>{
    res.sendFile(historyPagePath);
}

function uploadtoS3(data,filename){
    const bucketName = process.env.BUCKET_NAME;
    const iamUserKey = process.env.IAM_USER_KEY;
    const iamUserSecret = process.env.IAM_USER_SECRET;

    return new Promise((resolve,reject)=>{
        const s3bucket = new AWS.S3({
            accessKeyId: iamUserKey,
            secretAccessKey: iamUserSecret,
        });
    
        const params = {
            Bucket: bucketName,
            Key: filename,
            Body:data,
            ACL: 'public-read'
        }
    
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log("Something went wrong",err);
                reject(err);
            }else{
                console.log('Success',s3response);
                resolve(s3response.Location);
            }
        });
    })   
}

exports.downloadFile = async(req,res)=>{
    try {
        const { when } = req.query;
        let products;

        if(when === 'weekly'){
            products = await kiranaProducts.findAll({where: {
                userId: req.user.id,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
                }
            }});

        }else if(when === 'monthly'){
            products = await kiranaProducts.findAll({where: {
                userId: req.user.id,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) 
                }
            }});
        }else {
            products = await kiranaProducts.findAll({where: {
                userId: req.user.id,
                createdAt: {
                    [Op.gte]: new Date(new Date().getFullYear(), 0, 1) 
                }
            }});
        }        

        const stringifiedProducts = JSON.stringify(products);
        const filename = `Products${req.user.id}/${new Date()}.txt`;

        const fileurl = await uploadtoS3(stringifiedProducts,filename);
        console.log(fileurl);

        const newUrl = await downloads.create({
            downloadUrl:fileurl,
            userId:req.user.id
        })

        return res.status(200).json({
            fileurl: fileurl,
        })

    } catch (error) {
        res.status(500).json({fileurl: '',error: 'Error getting all products'});
    }    
}

exports.downloadedHistory = async (req,res)=>{
    try {
        const history = await downloads.findAll({where:{userId:req.user.id}});

        return res.status(200).json({
            history: history
        })
        
    } catch (error) {
        res.status(500).json({error: 'Error getting all products'});
    }
}

exports.showWeeklyData = async (req,res)=>{
    try {
        const products = await kiranaProducts.findAll({where: {
            userId: req.user.id,
            createdAt: {
                [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) 
            }
        }});

        return res.status(200).json({
            products: products,
        })
        
    } catch (error) {
        res.status(500).json({products: '',error: 'Error getting weekly products'});
    }
}

exports.showMonthlyData = async (req,res)=>{
    try {
        console.log("innn")
        const products = await kiranaProducts.findAll({where: {
            userId: req.user.id,
            createdAt: {
                [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) 
            }
        }});

        return res.status(200).json({
            products: products,
        })
        
    } catch (error) {
        res.status(500).json({products: '',error: 'Error getting monthly products'});
    }
}

exports.showYearlyData = async (req,res)=>{
    try {
        const products = await kiranaProducts.findAll({where: {
            userId: req.user.id,
            createdAt: {
                [Op.gte]: new Date(new Date().getFullYear(), 0, 1) 
            }
        }});

        return res.status(200).json({
            products: products,
        })
        
    } catch (error) {
        res.status(500).json({products: '',error: 'Error getting yearly products'});
    }
}