import asyncHandler from "express-async-handler";
import Color from "../models/Color.js";

// @desc Create new Brand
// @route POST /api/v1/brands
// @access Private/Admin

export const createColorCtrl = asyncHandler( async (req, res)=>{
    const {name} = req.body;

    // color exists

    const colorFound = await Color.findOne({name:name.toLowerCase()});
    if(colorFound){
        throw new Error ("Color Already Exists");
    }
    // create 
    const color = await Color.create({
        name: name.toLowerCase(),
        user : req.userAuthId,
    });

    res.json({
        status:"Success",
        message: "Color Created Successfully",
        color,
    })
});


// @desc   Get all colors
// @route  GET /api/colors
// @access Public

export const getAllColorsCtrl = asyncHandler( async (req, res)=>{
    
    const colors = await Color.find();

    res.json({
        status:"Success",
        message: "Colors fetched Successfully",
        colors,
    })
});


// @desc   Get single color
// @route  GET/api/colors/:id
// @access Public

export const getSingleColorCtrl = asyncHandler(async (req, res) =>{
    const color = await Color.findById(req.params.id);

    res.json({
        status : "Success",
        message : "Color fetched Successfully",
        color,
    })
})


// @desc   Update color
// @route  PUT /api/colors/:id/update
// @access Public

export const  updateColorCtrl = asyncHandler(async (req, res) =>{

    const {name} = req.body; 

    const color = await Color.findByIdAndUpdate(req.params.id, {
        name:name.toLowerCase(),
        },
        {
            new : true,
        }
    );
    res.json({
        status:"Success",
        message: "color updated Successfully",
        color
    });
});



// @desc delete brand
// @route  delete /api/brands/:id/delete
// @access Public

export const deleteColorCtrl = asyncHandler(async (req, res) =>{

    const color = await Color.findByIdAndDelete(req.params.id);
    res.json({
        status:"Success",
        message: "color deleted Successfully"
    });
});
