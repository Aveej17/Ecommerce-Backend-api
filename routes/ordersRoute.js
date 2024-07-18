import express from "express";
import { createOrderCtrl, getAllOrdersCtrl, getSingleOrdersCtrl, updateOrderCtrl, getOrderStatisticsCtrl } from "../controllers/orderCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn,createOrderCtrl);
orderRouter.get("/", isLoggedIn, getAllOrdersCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrdersCtrl);
orderRouter.get("/sales/stats", isLoggedIn, getOrderStatisticsCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);

export default orderRouter;