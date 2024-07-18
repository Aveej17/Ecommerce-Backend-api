import asyncHandler from "express-async-handler";

import Coupon from "../models/Coupon.js";

// @desc   Create new Coupon
// @route  POST /api/v1/coupons
// @access Private/Admin


export const createCouponCtrl = asyncHandler( async (req, res) => {
    
    const {code, startDate, endDate, discount} = req.body;
    // check if admin
    // check if coupon already exists

    const couponExists = await Coupon.findOne({code:code.toUpperCase()});

    if(couponExists){
        throw new Error("Coupon Already Exist");
    }

    // check if discount is a number

    if(isNaN(discount)){
        throw new Error("Discount value must be a number");
    }

    // create coupon

    const coupon = await Coupon.create(
        {
            code:code?.toUpperCase(),
            startDate,
            endDate,
            discount,
            user: req.userAuthId,
        }
    );

    res.json({
        status: "success",
        message:"Coupon Creation Ctrl",
        coupon,
    })
});


// @desc   Fetch All Coupons
// @route  get /api/v1/coupons
// @access Private/Admin

export const getAllCouponsCtrl = asyncHandler( async (req, res)=>{
    const coupons = await Coupon.find();

    res.json({
        status:"success",
        message:"All the coupons are fetched successfully",
        coupons,
    });
});


// @desc   Fetch Single Coupons
// @route  get /api/v1/coupons/:id
// @access Private/Admin

export const getSingleCouponsCtrl = asyncHandler( async (req, res)=>{
    const coupon = await Coupon.findById(req.params.id);

    res.json({
        status:"success",
        message:"Coupon fetched successfully",
        coupon,
    });
});


// @desc update coupon

export const updateCouponCtrl = asyncHandler( async (req, res) =>{
    const {code, startDate, endDate, discount} = req.body;
    const coupon = await Coupon.findByIdAndUpdate(
        req.params.id,
        {
            code:code?.toUpperCase(),
            discount,
            startDate,
            endDate,
        },
        {
            new : true,
        }
    );
    res.json({
        status: "success",
        message: "Coupon updated successfully",
        coupon,
    })

});


export const deleteCouponCtrl = asyncHandler( async (req, res) =>{

    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupon deleted successfully",
        coupon,
    })

});
