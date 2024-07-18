import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Brand from "../models/Brand.js";


// @desc Create new product
// @route POST /api/v1/products/create
// @access Private/Admin


export const createProductCtrl = asyncHandler( async (req, res) =>{

    //files uploaded in cloudinary and their paths are in the form of array inside the convertedImgs
    const convertedImgs = req.files.map((file) => file.path);

    const {name, description, brand, category, sizes, colors, price, totalQty} = req.body;


    // Product exists 

    const productExists = await Product.findOne({name});

    if(productExists){
        throw new Error("Product Already Exists");
    }

    // find the category
    const categoryFound = await Category.findOne({
        name:category.toLowerCase(),
    });

    if(!categoryFound){
        throw new Error(
            "Category not found, please category first or check category name"
        )
    }

    // find the brand
    const brandFound = await Brand.findOne({
        name:brand.toLowerCase(),
    });

    if(!brandFound){
        throw new Error(
            "Brand not found, please brand first or check brand name"
        )
    }
    // create the product

    const product = await Product.create({
        name, 
        description,
        brand,
        category,
        sizes,
        colors,
        user : req.userAuthId,
        price,
        totalQty,
        images:convertedImgs,
    });

    // push the product into Category
    categoryFound.products.push(product._id);
    
    // resave
    await categoryFound.save();

    
    // push the product into Brand
    brandFound.products.push(product._id);

     // resave
     await brandFound.save();


    // send response

    res.json({
        status:"Success",
        message: "Product created successfully",
        product,
    });
});


// @desc Get products
// @route POST /api/v1/products
// @access Public

export const getProductsCtrl = asyncHandler(async(req, res)=>{
    
    //query
    let productQuery = Product.find();
    // console.log(productQuery);

   
    // const products = await productQuery;
    // console.log(products)

    // Search by name

    if(req.query.name){
        productQuery = productQuery.find({
            name:{$regex: req.query.name, $options:"i"}
        })
    }

    // filter by brand
    if(req.query.brand){
        productQuery = productQuery.find({
            brand:{$regex: req.query.brand, $options:"i"}
        })
    }

    // filter by category
    if(req.query.category){
        productQuery = productQuery.find({
            category:{$regex: req.query.category, $options:"i"}
        })
    }

    // filter by colour
    if(req.query.color){
        productQuery = productQuery.find({
            colors:{$regex: req.query.color, $options:"i"}
        })
    }

    // filter by size
    if(req.query.size){
        productQuery = productQuery.find({
            sizes:{$regex: req.query.size, $options:"i"}
        })
    }
    
    // filter by price Range
    if(req.query.price){
        const priceRange = req.query.price.split("-");

        // gte - Greater than or equal to
        // lte - lesser than or equal to

        productQuery = productQuery.find({
            price:{$gte:priceRange[0], $lte:priceRange[1]}
        })
    }


    // pagination
    // page
    const page = parseInt(req.query.page) ?  parseInt(req.query.page) : 1;
    // limit
    const limit = parseInt(req.query.limit) ?  parseInt(req.query.limit) : 10;
    // console.log(limit);
    // startIndex
    const startIndex = (page-1)*limit;
    // endIndex
    const endIndex = page*limit;
    // total
    const total = await Product.countDocuments();

    productQuery = await productQuery.skip(startIndex).limit(limit);

    //pagination results

    const pagination = {};

    if(endIndex<total){
        pagination.next = {
            page:page+1,
            limit,
        }
    }
    if(startIndex>0){
        pagination.prev = {
            page:page-1,
            limit
        }
    }

    // await the query
    const products = await productQuery;
    res.json({
        status:"Success",
        totalProducts: total,
        results: products.length,
        pagination,
        message:"Products fetched successfully",
        products,
    })
})


// @desc Get Single Product
// @route GET /api/products/:id
// @access Public

export const getProductCtrl = asyncHandler(async (req, res)=>{
    // console.log(req.params);
    const product = await Product.findById(req.params.id).populate('reviews');
    if(!product){
        throw new Error("Product not Found");
    }
    res.json({
        status:"Success",
        message: "Product fetched Successfully",
        product
    })
});


// @desc Update Product
// @route PUT /api/products/:id/update
// @access Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res)=>{

    const {name, description, brand, category, sizes, colors, price, totalQty} = req.body;
    
    // update 
    const product = await Product.findByIdAndUpdate(req.params.id, {
        name,
        description, 
        brand, 
        category, 
        sizes, 
        colors, 
        price, 
        totalQty},
        {
            new : true,
        }
    );
    res.json({
        status:"Success",
        message: "Product updated Successfully",
        product
    })
});



// @desc delete Product
// @route delete /api/products/:id/delete
// @access Private/Admin

export const deleteProductCtrl = asyncHandler(async (req, res)=>{

    // delete
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({
        status:"Success",
        message: "Product deleted Successfully",
    })
});


// // /demo
export const demoFileUploadCtrl = asyncHandler(async(req, res)=>{
//     try {
//         console.log("File upload endpoint hit");

//         if (!req.files) {
//             console.log("No file received");
//             res.status(400).json({ message: "No file uploaded" });
//             return;
//         }

//         // Log the file details
//         console.log(req.files);

//         res.json({
//             message: "Files uploaded successfully",
//             fileUrl: req.files.path, // Cloudinary URL
//         });
//     } catch (error) {
//         console.error("Error occurred during file upload:", error);
//         res.status(500).json({ message: "Something went wrong", error: error.message });
//     }

//     // console.log(files);
})