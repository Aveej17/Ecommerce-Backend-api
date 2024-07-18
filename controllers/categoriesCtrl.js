import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// @desc Create new category
// @route POST /api/v1/categories
// @access Private/Admin

export const createCategoryCtrl = asyncHandler( async (req, res)=>{
    const {name} = req.body;

    // category exists

    const categoryFound = await Category.findOne({name:name.toLowerCase()});
    if(categoryFound){
        throw new Error ("Category Already Exists");
    }
    // create 
    const category = await Category.create({
        name: name.toLowerCase(),
        user : req.userAuthId,
        image: req.file.path,
    });

    res.json({
        status:"Success",
        message: "Category Created Successfully",
        category,
    })
});


// @desc   Get all categories
// @route  GET /api/categories
// @access Public

export const getAllCategoriesCtrl = asyncHandler( async (req, res)=>{
    
    const categories = await Category.find();

    res.json({
        status:"Success",
        message: "Category fetched Successfully",
        categories,
    })
});


// @desc   Get Single Categories
// @route  GET/api/categories/:id
// @access Public

export const getSingleCategoryCtrl = asyncHandler(async (req, res) =>{
    const category = await Category.findById(req.params.id);

    res.json({
        status : "Success",
        message : "Category fetched Successfully",
        category,
    })
})


// @desc   Update category
// @route  PUT /api/categories/:id/update
// @access Public

export const  updateCategoryCtrl = asyncHandler(async (req, res) =>{

    const {name} = req.body; 

    const category = await Category.findByIdAndUpdate(req.params.id, {
        name,
        },
        {
            new : true,
        }
    );
    res.json({
        status:"Success",
        message: "category updated Successfully",
        category
    });
});



// @desc delete category
// @route  delete /api/categories/:id/delete
// @access Public

export const deleteCategoryCtrl = asyncHandler(async (req, res) =>{

    

    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:"Success",
        message: "category deleted Successfully"
    });
});
