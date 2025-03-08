import express from "express";
import { checkAuth, login, logout, signup, updateProfile, updatePhone, updateAddress } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);

router.put("/update-profile", protectRoute, updateProfile);
router.put("/updatePhone", protectRoute, updatePhone);
router.put("/updateAddress", protectRoute, updateAddress);

router.get("/check", protectRoute, checkAuth);

export default router;