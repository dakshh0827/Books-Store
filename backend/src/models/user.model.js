import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Store ID as is
  bookTitle: { type: String, required: true }, // Store book title
  bookAuthor: { type: String, required: true }, // Store book author
  bookEdition: { type: Number, required: true }, // Store book edition
  type: { type: String, enum: ["BUY", "RENT"], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profilePic: {
      type: String,
      default: "",
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
    },
    languagePreference: {
      type: String,
      enum: ["en", "hi", "es", "fr", "de"],
      default: "en",
    },
    notificationSettings: {
      dailyNotifications: { type: Boolean, default: true },
    },
    transactions: [transactionSchema], // Store bought/rented book history
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
