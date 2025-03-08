import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    items: [
      {
        bookID: {
          type: mongoose.Schema.Types.ObjectId, // Store original Book ID
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        author: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
          enum: ["LEND", "SELL", "BOTH"],
        },
        edition: {
          type: Number,
          required: true,
        },
        lendingPrice: {
          type: Number,
          required: function () {
            return this.category === "LEND" || this.category === "BOTH";
          },
        },
        sellingPrice: {
          type: Number,
          required: function () {
            return this.category === "SELL" || this.category === "BOTH";
          },
        },
        picture: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        sold: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
