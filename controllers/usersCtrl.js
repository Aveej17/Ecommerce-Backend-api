import User from "../models/User.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";




// @desc Register User
// @route POST /api/v1/users/register
// @access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) =>{

    try {
        const { fullname, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            // return res.status(400).json({
            //     msg: "User already exists"
            // });
            // THIS THROW WILL NOT WORK DUE TO TRY CATCH
            throw new Error("User already exists");

        }

        // hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            status: "Success",
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        if(userExists){
            throw new Error("User already exists");
        }
        else{
            throw new Error("Server error");
        }
        // console.error(error.message);
        // res.status(500).json({
        //     status: "Error",
        //     message: "Server error"
        // });
    }
});

// @desc Login User
// @route POST /api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;

    // Find the user in db by email only

    const userFound = await User.findOne({email});

    if(!userFound){
        return res.json({
            msg:"Invalid username details"
        })
    }

    if (userFound && await bcrypt.compare(password, userFound?.password)){
        return res.json({
            status:"Success",
            message: "User Login Successfully",
            userFound,
            token:generateToken(userFound?._id)
        })

    }else{
        throw new Error("Invalid password");
    }  
});


// @desc Get User Profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfileCtrl = asyncHandler(async (req, res)=>{

    const user = await User.findById(req.userAuthId).populate('orders');
    // console.log(req.headers);
    // const token  = getTokenFromHeader(req);
    // console.log(token);

    // verify token
    // const verified = verifyToken(token);
    // console.log(verified);
    // console.log(req);




    res.json({
        status: "success",
        message:"User profile fetched Successfully",
        user,
    });
    // try {
    //     const token = getTokenFromHeader(req);

    //     // Verify token
    //     const verified = await verifyToken(token);
    //     console.log(verified);

    //     res.json({
    //         msg: "Welcome to profile page",
    //         user: verified, // Optionally include verified user data
    //     });
    // } catch (error) {
    //     console.log('Error:', error);
    //     res.status(401).json({
    //         msg: error,
    //     });
    // }
});


// @desc   Update user Shipping Address
// @route  PUT /api/v1/users/update/shipping
// @access Private

export const updateShippingAddressCtrl = asyncHandler (async (req, res)=>{
    const {firstName, lastName, address, city, postalCode, province, phone} = req.body;

    const user = await User.findByIdAndUpdate(req.userAuthId,
        {
            shippingAddress: {
                firstName,
                lastName, 
                address, 
                city, 
                postalCode, 
                province, 
                phone
            },
            hasShippingAddress: true, 
        },
        {
            new : true,
        }
    )
    
    res.json({
        success:true,
        message:"Shipping address updated",
        user,
    })
})