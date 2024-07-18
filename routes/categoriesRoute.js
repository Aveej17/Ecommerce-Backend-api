import express from "express";
import { createCategoryCtrl, getAllCategoriesCtrl, getSingleCategoryCtrl, updateCategoryCtrl, deleteCategoryCtrl } from "../controllers/categoriesCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/fileUpload.js";


const categoriesRouter = express.Router();

categoriesRouter.post("/", isLoggedIn, upload.single('file'), createCategoryCtrl)
categoriesRouter.get("/",  getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.put("/:id/update", isLoggedIn,  updateCategoryCtrl);
categoriesRouter.delete("/:id/delete", isLoggedIn, deleteCategoryCtrl);

export default categoriesRouter;