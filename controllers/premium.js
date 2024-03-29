const path = require('path');
const Razorpay = require('razorpay');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');

const Order = require('../models/order');
const User = require('../models/users');
const kiranaProducts = require('../models/kiranaProducts');
const premiumPagePath = path.join(__dirname,'../views/premium.html');

exports.displayPremiumPage = (req,res)=>{
    res.sendFile(premiumPagePath);
}

exports.buyPremium = async(req,res)=>{
    try {
        //create razorpay object  
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })

        var options = {
            amount: 100000,
            currency:'INR'
        }

        //create a razorpay order
        rzp.orders.create(options,async (err,order)=>{
            if(err){
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            const neworder = await Order.create({
                orderId: order.id,
                status: "PENDING",
                userId:req.user.id
            })

            return res.status(200).json({ orderId: order.id, amount: order.amount, key_id: process.env.RAZORPAY_KEY_ID });
        })
    } catch (error) {
        res.status(500).json({error: 'Error creating order'});
    }
}

exports.updateTransaction = async (req,res)=>{
    try {
        const {order_id,payment_id} = req.body;

        const order = await Order.findOne({where:{orderId:order_id}});
        const promise1 = order.update({paymentId:payment_id,status:'SUCCESS'});
        const promise2 = req.user.update({ispremiumuser:true});

        Promise.all([
            promise1,
            promise2
        ]).then(()=>{
            return res.status(200).json({ success: true, msg: "Transaction Successful" ,
                                        token:jwt.sign({userId:req.user.id,ispremiumuser:true}, process.env.SECRETKEY, { expiresIn: '1h' })});

        }).catch((err)=>{
            res.status(500).json({err: 'Error updating order'});
        })

    } catch (error) {
        res.status(500).json({error: 'Error updating order'});
    }
}
exports.showLeaderboard = async (req,res)=>{
    try {
        const users = await User.findAll({
            attributes: [
                'id',
                'username',
                'totalspend'
            ],
            order: [['totalspend', 'DESC']]
        });

        const userdata = users.map(user => ({
            id: user.id,
            username: user.username,
            total_spend: user.get('totalspend')
          }));        
        
        return res.status(200).json({ userdata: userdata });
        
    } catch (error) {
        res.status(500).json({error: 'Error fetching leaderboard data'});
    }
}

// exports.showLeaderboard = async (req,res)=>{
//     try {
//         console.log("Inside")
//         const user = await User.findAll(
//         {   
//             attributes: [
//                 'id',
//                 'username',
//                 [sequelize.fn('SUM', sequelize.col('kiranaproducts.price')), 'total_spend']
//             ],
//             include: [
//                 {
//                     model: kiranaProducts,
//                     attributes: []
//                 }
//             ],
//             group: ['users.id', 'kiranaproducts.userId'],
//             order: sequelize.literal('total_spend DESC')
//         });
//         const userdata = user.map(user => ({
//             id: user.id,
//             username: user.username,
//             total_spend: user.get('total_spend')
//         }));

//         console.log(userdata);
//         return res.status(200).json({ userdata: userdata });
        
//     } catch (error) {
//         res.status(500).json({error: 'Error fetching leaderboard data'});
//     }
// }