import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
      const token = req.cookies.jwt;
      console.log("token in protectRoute: ", token);

      if (!token) {
          // console.log("!token");
          return res.status(401).json({ message: "Unauthorized - No Token Provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_KEY);

      // console.log("Decoded userId from JWT:", decoded.userId);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
          // console.log("!user");
          return res.status(404).json({ message: "User not found" });
      }

      console.log("Authenticated User in protectRoute");
      req.user = user;

      next();
  } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};
