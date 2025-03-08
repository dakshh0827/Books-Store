import express from "express";
import { addLendSell, getBookDetails, getLendBooks, getSellBooks, addToCart, getCartBooks, updateCartItemQuantity, deleteCartItem, updateNotificationSettings, updateLanguageSettings, getLanguageSettings, getBooksStats, getBooksBought, getBooksRented } from "../controllers/books.controller.js";
import { uploadBase64Image } from "../middlewares/books.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/upload", uploadBase64Image);
router.post("/lendSellBooks", protectRoute, addLendSell);
router.get("/getLendBooks", protectRoute, getLendBooks);
router.get("/getSellBooks", protectRoute, getSellBooks);
router.get("/getBookDetails/:id", protectRoute, getBookDetails);
router.post("/addToCart/:id", protectRoute,  addToCart);
router.get("/getCartBooks", protectRoute, getCartBooks);
router.post("/updateCartItemQuantity", protectRoute, updateCartItemQuantity);
router.post("/deleteCartItem", protectRoute, deleteCartItem);
router.post("/notificationSettings/:settings", protectRoute, updateNotificationSettings);
router.post("/languageSettings/:settings", protectRoute, updateLanguageSettings);
router.get("/getLanguageSettings", protectRoute, getLanguageSettings);
router.get("/totalTransactions", protectRoute, getBooksStats);
router.post("/transactions/bought", protectRoute, getBooksBought);
router.post("/transactions/rented", protectRoute, getBooksRented);

export default router;