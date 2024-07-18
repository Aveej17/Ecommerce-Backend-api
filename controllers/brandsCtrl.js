import asyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";

// @desc Create new Brand
// @route POST /api/v1/brands
// @access Private/Admin

export const createBrandCtrl = asyncHandler( async (req, res)=>{
    const {name} = req.body;

    // brand exists

    const brandFound = await Brand.findOne({name:name.toLowerCase()});
    if(brandFound){
        throw new Error ("Brand Already Exists");
    }
    // create 
    const brand = await Brand.create({
        name: name.toLowerCase(),
        user : req.userAuthId,
    });

    res.json({
        status:"Success",
        message: "Brand Created Successfully",
        brand,
    })
});


// @desc   Get all brands
// @route  GET /api/brands
// @access Public

export const getAllBrandsCtrl = asyncHandler( async (req, res)=>{
    
    const brands = await Brand.find();

    res.json({
        status:"Success",
        message: "Brands fetched Successfully",
        brands,
    })
});


// @desc   Get single brand
// @route  GET/api/brands/:id
// @access Public

export const getSingleBrandCtrl = asyncHandler(async (req, res) =>{
    const brand = await Brand.findById(req.params.id);

    res.json({
        status : "Success",
        message : "Brand fetched Successfully",
        brand,
    })
})


// @desc   Update brand
// @route  PUT /api/brands/:id/update
// @access Public

export const  updateBrandCtrl = asyncHandler(async (req, res) =>{

    const {name} = req.body; 

    const brand = await Brand.findByIdAndUpdate(req.params.id, {
        name:name.toLowerCase(),
        },
        {
            new : true,
        }
    );
    res.json({
        status:"Success",
        message: "brand updated Successfully",
        brand
    });
});



// @desc delete brand
// @route  delete /api/brands/:id/delete
// @access Public

export const deleteBrandCtrl = asyncHandler(async (req, res) =>{

    

    const brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({
        status:"Success",
        message: "brand deleted Successfully"
    });
});
