import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
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
        status: {
            type: String,
            enum: ["Available", "Rented"],
            default: function () {
                return this.category === "LEND" ? "Available" : undefined;
            },
        },
    }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
