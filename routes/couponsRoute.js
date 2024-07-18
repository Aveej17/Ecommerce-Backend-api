import express from "express";
import { createCouponCtrl, getAllCouponsCtrl,getSingleCouponsCtrl,updateCouponCtrl, deleteCouponCtrl } from "../controllers/couponsCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";


const couponsRouter = new express.Router();

couponsRouter.post("/", isLoggedIn, isAdmin, createCouponCtrl);
couponsRouter.get("/",  getAllCouponsCtrl);
couponsRouter.get("/:id",  getSingleCouponsCtrl);
couponsRouter.put("/update/:id", isLoggedIn, isAdmin, updateCouponCtrl);
couponsRouter.delete("/delete/:id", isLoggedIn, isAdmin, deleteCouponCtrl);

export default couponsRouter;