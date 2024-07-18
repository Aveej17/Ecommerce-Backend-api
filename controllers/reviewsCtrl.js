import asyncHandler from "express-async-handler"
import Product from "../models/Product.js";
import Review from "../models/Review.js"

// @desc Create new review
// @route POST /api/v1/reviews
// @access Private/Admin

export const createReviewCtrl = asyncHandler( async (req, res) => {

    const {product, message, rating} = req.body;

    // find the productId

    const {productID} = req.params;
    // console.log(req.params); 
    const productFound = await Product.findById(productID).populate("reviews");
    // console.log(productFound);
    if(!productFound){
        throw new Error("Product Not Found");
    }

    // check if user Already reviewed the product
    const hasReviewed = productFound?.reviews?.find((review) =>{
        // console.log(review);
        return review?.user?.toString() === req?.userAuthId?.toString();
    });
    
    // console.log(`has reviewed : ${hasReviewed}`);


    if(hasReviewed){
        throw new Error("You have already reviewed this product");
    }
    // create a review
    const review = await Review.create({
        message,
        rating,
        product: productFound?._id,
        user:req.userAuthId
    })

    // push review into the productFound

    productFound.reviews.push(review?._id);

    // resave
    await productFound.save();
    res.status(201).json({
        success: true,
        message:"Review created Successfully",
    });
});