import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";

import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";


dotenv.config();

// stripe instance

const stripe = new Stripe(process.env.STRIPE_KEY);

// @desc create orders
// @route POST /api/v1/orders
// @access private

export const createOrderCtrl = asyncHandler(async(req, res) =>{


    //Get the Coupon
    // console.log(req.query);
    const {coupon} = req?.query;
    const couponFound = await Coupon.findOne({
        code:coupon?.toUpperCase(),
    });

    if(couponFound?.isExpired){
        throw new Error("The Given Coupon is expired :(");
    }
    if(!couponFound){
        throw new Error("Coupon does not exists");
    }

    // get discount
    const discount = couponFound?.discount / 100;

    // Get the payload(customer, orderItems, shippingAddress, totalPrice);

    const {orderItems, shippingAddress, totalPrice} = req.body;
    // console.log({
    //     orderItems,
    //     shippingAddress,
    //     totalPrice,
    // });
    // Find the User
    const user = await User.findById(req.userAuthId);
    // console.log(user);

    // check if the user has shippping address
    if (!user?.hasShippingAddress) {
        throw new Error("Please provide shipping address");
    }

    // Check if Order is not empty

    if(orderItems?.length <=0){
        throw new Error("No Order Items");
    }

    // Place/Create Order - save into DB

    const order = await Order.create({
        user : user?._id,
        orderItems,
        shippingAddress,
        totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    });


    // console.log(order);


    // Update the product Qty
    const products = await Product.find({_id:{$in:orderItems}});
    // console.log(products);
    orderItems?.map(async (order) =>{
        const product = products?.find((product)=>{
            return product._id.toString() === order?._id.toString();
        });
        if(product){
            product.totalSold += order.totalQtyBuying;
        }
        await product.save();
    })

    // push Order into User

    // console.log(order);
    user.orders.push(order?._id);

    await user.save();

    // make payment (stripe)

    // convert order items to have same structure that stripe need
    const convertedOrders = orderItems.map((item) =>{
        return {
            price_data:{
                currency:"inr",
                product_data:{
                    name: item?.name,
                    description:item?.description,
                },
                unit_amount: item?.price * 100,
            },
            quantity: item?.qty,
        }
    })



    const session = await stripe.checkout.sessions.create({
        // line_items:[
        //     {
        //         price_data:{
        //             currency: "usd",
        //             product_data:{
        //                 name: "Hats",
        //                 description: "Best Hat",
        //             },
        //             unit_amount: 10 * 100,
        //         },
        //         quantity : 2,
        //     },
        // ],

        line_items: convertedOrders,
        metadata: {
            orderId : JSON.stringify(order?._id),
        },
        mode:"payment",
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    res.send(
        {
            order,
            url:session.url
        }
    );

    // Payment Webhook
    // Update the user order

    // res.json({
    //     success:true,
    //     message: "Order Created",
    //     order,
    //     user,    
    // });
});


// @desc fetch All Orders
// @route GET /api/v1/orders
// @access private/admin

export const getAllOrdersCtrl = asyncHandler(async (req, res)=>{

    // find all orders
    const orders = await Order.find();

    res.json({
        success: true,
        message:"All Orders",
        orders,
    })
});


// @desc fetch Single Order
// @route GET /api/v1/orders/:id
// @access private/admin

export const getSingleOrdersCtrl = asyncHandler(async (req, res)=>{

   // get the id from params
    const id = req.params.id;
    const order = await Order.findById(id);

    res.json({
        success: true,
        message:"All Orders",
        order,
    })
});


// @desc update the order
// @route GET /api/v1/orders/update/:id
// @access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res)=>{

    // get the id from params
    const id = req.params.id;
    const updatedorder = await Order.findByIdAndUpdate(
        id,
        {
            status:req.body.status,
        },
        {
            new : true,
        }
    );

    res.json({
        success: true,
        message:"Order Updated",
        updatedorder,
    })
});



// @desc get sales sum of orders
// @route GET /api/v1/orders/sales/stats
// @access private/admin

export const getOrderStatisticsCtrl= asyncHandler( async(req, res) =>{

    // get the sales
    const OrderStats = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales:{
                    $sum: "$totalPrice",
                },
                minimumSale:{
                    $min:"$totalPrice",
                },
                maximumSale:{
                    $max:"$totalPrice",
                },
                AverageSale:{
                    $avg:"$totalPrice",
                }
            },
        },
    ]);

    // As this is a same group commenting this
    // const getMinimumOrder = await Order.aggregate([
    //     {
    //         $group:{
    //             _id:null,
    //             minimumSale:{
    //                 $min:"$totalPrice",
    //             },
    //         },
    //     },
    // ]);


    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log(today);

    const salesToday = await Order.aggregate([
        {
            $match: {
              createdAt: {
                $gte: today,
              },
            },
        },
        {
            $group: {
              _id: null,
              totalSales: {
                $sum: "$totalPrice",
              },
            },
        },
    ]);

    res.json({
        success: true,
        message:"Sum of Orders",
        OrdersStats: OrderStats,
        SalesToday:salesToday,
        // LowestPricedOrderAmount:getMinimumOrder,
    });
});