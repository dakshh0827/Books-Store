import User from "../models/user.model.js";
import Book from "../models/books.model.js";
import Cart from "../models/cart.model.js";
import cloudinary from "cloudinary";

export const addLendSell = async (req, res) => {
    try {
        const { title, author, edition, category, lendingPrice, sellingPrice, picture } = req.body;

        if(!title || !author || !edition || !category || !picture ||
            (category === "LEND" && !lendingPrice) ||
            (category === "SELL" && !sellingPrice) ||
            (category === "BOTH" && (!lendingPrice || !sellingPrice))) {
            return res.status(400).json({message: "All fields are required!"});
        }

        const uploadResponse = await cloudinary.uploader.upload(picture, {
            folder: "lendSellBooks"
        });

        const normalizedCategory = category.toUpperCase();

        const bookData = {
            title,
            author,
            edition,
            category: normalizedCategory,
            picture: uploadResponse.secure_url
        };

        if (normalizedCategory === "LEND" || normalizedCategory === "BOTH") {
            bookData.lendingPrice = lendingPrice;
        }
        if (normalizedCategory === "SELL" || normalizedCategory === "BOTH") {
            bookData.sellingPrice = sellingPrice;
        }

        const newBook = new Book(bookData);
        await newBook.save();
        res.status(201).json(newBook);

    } catch(error) {
        console.error("error in addLendSell controller: ", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getLendBooks = async (req, res) => {
    try {
        const books = await Book.find({
            $or: [
                {category: "LEND"},
                {category: "BOTH"}
            ]
        });
        res.status(200).json(books);
    } catch (error) {
        console.error("error in the getLendBooks controller: ", error);
        res.status(400).json({message: "Internal server error", error: error});
    }
};

export const getSellBooks = async (req, res) => {
    try {
        const books = await Book.find({
            $or: [
                {category: "SELL"},
                {category: "BOTH"}
            ]
        });
        res.status(200).json(books);
    } catch (error) {
        console.error("error in the getSellBooks controller: ", error);
        res.status(400).json({message: "Internal server error", error: error});
    }
};

export const getBookDetails = async (req, res) => {
    const bookID = req.params.id;
    try {
        const book = await Book.findById(bookID);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        console.error("error in the getBookDetails controller: ", error);
        res.status(400).json({message: "Internal server error", error: error});
    }
};

export const addToCart = async (req, res) => {
    const userID = req.user._id;
    const bookID = req.params.id;

    try {
        const book = await Book.findById(bookID);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        let cart = await Cart.findOne({ userID });
        if (!cart) {
            cart = new Cart({ userID, items: [] });
        } else if (!Array.isArray(cart.items)) {
            cart.items = []; // Ensure `items` is an array
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.bookId?.toString() === book._id.toString()
        );

        if (existingItemIndex > -1) {
            return res.status(400).json({ message: "Book is already in the cart" });
        }

        const newCartBook = {
            bookID: book._id,  // Added bookId field
            title: book.title,
            author: book.author,
            edition: book.edition,
            category: book.category,
            picture: book.picture,
        };

        if (book.category === "LEND" || book.category === "BOTH") {
            newCartBook.lendingPrice = book.lendingPrice;
        }
        if (book.category === "SELL" || book.category === "BOTH") {
            newCartBook.sellingPrice = book.sellingPrice;
        }

        cart.items.push(newCartBook);
        await cart.save();
        res.status(200).json({ message: "Book added to cart", cart });

    } catch (error) {
        console.error("Error in the addToCart controller:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getCartBooks = async (req, res) => {
    try {
        // console.log("Authenticated User ID from req.user:", req.user._id);

        const cart = await Cart.findOne({ userID: req.user._id }).populate("userID");

        if (!cart) {
            return res.status(404).json({ message: "No items in the cart." });
        }

        const updatedItems = cart.items.map(item => ({
            ...item.toObject(),
            soldTag: item.sold ? "Sold" : null
        }));

        // console.log("Cart found:", cart);
        res.status(200).json({ ...cart.toObject(), items: updatedItems });

    } catch (error) {
        console.error("Error in the getCartBooks controller:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { bookID, quantity } = req.body;
    const userID = req.user.id;
    
    const cart = await Cart.findOne({ userID });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === bookID);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Book not found in cart." });
    }

    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    res.status(200).json({ message: "Item quantity updated in the cart", cart });
    
  } catch (error) {
    console.error("Error updating the cart item: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteCartItem = async (req, res) => {
    try {
      const { bookID } = req.body;
      console.log("fetching userID deleteCartItem : ");
      const userID = req.user.id;
      console.log("userID deleteCartItem : ", userID);

      const cart = await Cart.findOne({ userID });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found." });
      }
      
      const itemIndex = cart.items.findIndex(item => item.bookID.toString() === bookID);
      if (itemIndex === -1) {
        return res.status(404).json({ message: "Book not found in cart." });
      }

      cart.items.splice(itemIndex, 1);

      await cart.save();
  
      res.status(200).json({ message: "Item removed from cart", cart });

    } catch (error) {
      console.error("Error in deleting cart item: ", error);
      res.status(500).json({ message: "Internal server error", error });
    }
};

export const updateNotificationSettings = async (req, res) => {
    const settings = req.params.settings;
    console.log(settings);
    const userID = req.user._id;
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (settings !== undefined) user.notificationSettings.dailyNotifications = settings;
        await user.save();
        res.status(200).json({
            message: "Notification settings updated successfully",
            notificationSettings: user.notificationSettings,
        });
    } catch (error) {
        console.error("Error updating notification settings:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateLanguageSettings = async (req, res) => {
    const settings = req.params.settings;
    const userID = req.user._id;
    try {
        const user = await User.findById(userID);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(settings !== undefined) user.languagePreference = settings;
        await user.save();
        res.status(200).json({
            message: "Language preference updated successfully",
        });
    } catch (error) {
        console.error("Error updating langugae preference settings:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getLanguageSettings = async (req, res) => {
    const userID = req.user._id;
    try {
        const user = await User.findById(userID);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            languagePreference: user.languagePreference
        });
    } catch (error) {
        console.error("Error fetching langugae preference settings:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getBooksStats = async (req, res) => {
  try {
    const userID = req.user._id;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const booksBought = user.transactions.filter((t) => t.type === "BUY").length;
    const booksRented = user.transactions.filter((t) => t.type === "RENT").length;

    res.status(200).json({ booksBought, booksRented });
  } catch (error) {
    console.error("Error fetching books stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBooksBought = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate("transactions.bookId", "title author edition");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("Checking transactions...");
      if (!user.transactions || user.transactions.length === 0) {
        return res.status(200).json([]); // Return an empty array if no transactions exist
      }
      console.log("transactions: ", user.transactions);
  
      console.log("Fetching bought books...");
      const boughtBooks = user.transactions
        .filter((transaction) => transaction.type === "BUY" && transaction.bookId) // Ensure bookId exists
        .map((transaction) => ({
          id: transaction.bookId,
          title: transaction.bookTitle,
          author: transaction.bookAuthor,
          edition: transaction.bookEdition,
          amount: transaction.amount, // Fetching the amount from the transaction itself
          date: transaction.date,
        }));
        console.log("books bought: ", boughtBooks);
  
      res.status(200).json(boughtBooks);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };

  export const getBooksRented = async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId).populate("transactions.bookId");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const rentedBooks = user.transactions
        .filter((transaction) => transaction.type === "RENT")
        .map((transaction) => ({
          id: transaction.bookId._id,
          title: transaction.bookId.title,
          author: transaction.bookId.author,
          edition: transaction.bookId.edition,
          amount: transaction.amount,
          date: transaction.date,
          dueDate: transaction.dueDate, // Include due date
        }));
  
      res.status(200).json(rentedBooks);
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  