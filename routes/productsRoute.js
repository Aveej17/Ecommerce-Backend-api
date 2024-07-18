import express from "express";
import { createProductCtrl, getProductsCtrl, getProductCtrl, updateProductCtrl, deleteProductCtrl, demoFileUploadCtrl} from "../controllers/productsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
// import uploadMiddleware from "../config/fileUpload.js";
import upload from "../config/fileUpload.js"
import isAdmin from "../middlewares/isAdmin.js";



const productsRouter = express.Router();

productsRouter.post("/", isLoggedIn, isAdmin, upload.array('files'), createProductCtrl);
productsRouter.get("/",  getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put("/:id/update", isLoggedIn, isAdmin, updateProductCtrl);
productsRouter.delete("/:id/delete", isLoggedIn,isAdmin, deleteProductCtrl);


// productsRouter.post("/demo",demoFileUploadCtrl);

export default productsRouter;