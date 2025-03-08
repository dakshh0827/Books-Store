import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Book from "../models/books.model.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

dotenv.config();

const razorpay = new Razorpay({
  // key_id: process.env.RAZORPAY_KEY_ID,
  // key_secret: process.env.RAZORPAY_KEY_SECRET,
  key_id: "rzp_test_iBxQQF9d1tG1ek",
  key_secret: "hvlQ7LbDHlW1NkgZZri636KQ",
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      res.json({ 
        success: true, 
        message: "Payment Verified Successfully!",
      });
    } else {
      res.status(400).json({ message: "Payment Verification Failed!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error verifying payment");
  }
};

export const addTransactionAndDeleteBook = async (req, res) => {
  try {
    const { userId, bookId, type, amount } = req.body;

    // Validate input
    if (!userId || !bookId || !type || !amount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("book id:", bookId);
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Step 1: Calculate Due Date for Rent Transactions
    let dueDate = null;
    if (type === "RENT") {
      dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // Set due date to 14 days from now
    }

    // Step 2: Add the transaction with due date if rented
    const transaction = {
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookEdition: book.edition,
      type,
      amount,
      date: new Date(),
      ...(dueDate && { dueDate }), // Add dueDate only for RENT
    };

    user.transactions.push(transaction);
    await user.save();

    // Step 3: Update the book status
    if (type === "BUY") {
      await Book.findByIdAndDelete(bookId); // Delete the book if bought
    } else if (type === "RENT") {
      await Book.findByIdAndUpdate(bookId, { status: "Rented" }); // Mark book as rented
    }

    // Step 4: Update other users' carts (mark book as sold)
    await Cart.updateMany(
      { "items.bookID": bookId, userID: { $ne: userId } },
      { $set: { "items.$.soldTag": type === "BUY" ? "Sold" : "Rented" } }
    );

    // Step 5: Remove book from the buyer's cart if present
    const cart = await Cart.findOne({ userID: userId });

    if (cart) {
      const updatedItems = cart.items.filter(item => item.bookID.toString() !== bookId.toString());

      if (updatedItems.length !== cart.items.length) {
        cart.items = updatedItems;
        await cart.save();
        console.log("Book removed from cart.");
      }
    }

    res.status(200).json({
      message: `Transaction recorded successfully. Book ${type === "BUY" ? "removed" : "marked as rented"}.`,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
