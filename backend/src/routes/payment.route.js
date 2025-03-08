import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, addTransactionAndDeleteBook } from "../controllers/payment.controller.js";
import { deleteCartItem } from "../controllers/books.controller.js";

const router = express.Router();

router.post("/order", createOrder);
router.post("/verify", verifyPayment);
router.post("/transactions/add", protectRoute, addTransactionAndDeleteBook);
// router.post("/cart/updateSoldStatus", protectRoute, deleteCartItem);

export default router;