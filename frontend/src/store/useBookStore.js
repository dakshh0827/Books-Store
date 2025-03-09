import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const addBookStore = create((set, get) => ({
  isAdding: false,
  addedBook: null,

  addBook: async (data) => {
    set({ isAdding: true });
    try {
      const res = await axiosInstance.post("/books/lendSellBooks", data);
      set({ addedBook: res.data });
      const addedBook = get().addedBook;
      console.log(addedBook);
      toast.success(`Book added to ${addedBook.category}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred during adding the book.";
      toast.error(errorMessage);
    } finally {
      set({ isAdding: false });
    }
  },
}));

export const getBooksToBuy = create((set, get) => ({
  isFetchingBooks: false,
  books: [],

  booksToBuy: async () => {
    set({ isFetchingBooks: true });
    try {
      const res = await axiosInstance.get("/books/getSellBooks");
      set({ books: res.data });
      console.log(res.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching the books.";
      toast.error(errorMessage);
    } finally {
      set({ isFetchingBooks: false });
    }
  }
}));

export const getBooksToRent = create((set, get) => ({
  isFetchingBooks: false,
  books: [],

  booksToRent: async () => {
    set({ isFetchingBooks: true });
    try {
      const res = await axiosInstance.get("/books/getLendBooks");
      set({ books: res.data });
      console.log(res.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching the books.";
      toast.error(errorMessage);
    } finally {
      set({ isFetchingBooks: false });
    }
  }
}));

export const getBookDetails = create((set, get) => ({
  isFetchingDetails: false,
  book: null,

  bookDetails: async(id) => {
    set({ isFetchingDetails: true });
    try {
      const res = await axiosInstance.get(`/books/getBookDetails/${id}`);
      set({ book: res.data });
      console.log(res.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching the details";
      toast.error(errorMessage);
    } finally {
      set({ isFetchingDetails: false });
    }
  }
}));

export const addToCart = create((set) => ({
  isAddingToCart: false,
  addedBook: null,

  addCart: async (id) => {
    set({ isAddingToCart: true });
    try {
      const res = await axiosInstance.post(`/books/addToCart/${id}`);
      set({ addedBook: res.data.cart });
      toast.success("Book added to cart");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An error occurred while adding the book to the cart";
      toast.error(errorMessage);
    } finally {
      set({ isAddingToCart: false });
    }
  },
}));

export const getCartBooks = create((set, get) => ({
  isFetching: false,
  books: [],
  
  getBooks: async () => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.get("/books/getCartBooks");

      // Ensure sold books are marked properly
      const updatedBooks = res.data.items.map(book => ({
        ...book,
        sold: book.soldTag === "Sold", // Add sold flag for frontend use
      }));

      set({ books: updatedBooks });
      console.log(res.data);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while fetching the books";
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  updateCartItemQuantity: async (bookID, quantity) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.post("/books/updateCartItemQuantity", { bookID, quantity });

      // Update the books in the cart
      const updatedBooks = res.data.cart.items.map(book => ({
        ...book,
        sold: book.soldTag === "Sold",
      }));

      set({ books: updatedBooks });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating the cart";
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  },

  deleteCartItem: async (bookID) => {
    set({ isFetching: true });
    try {
      const res = await axiosInstance.post("/books/deleteCartItem", { bookID });
      toast.success("Item removed from cart");
      const updatedBooks = res.data.cart.items.map(book => ({
        ...book,
        sold: book.soldTag === "Sold",
      }));

      set({ books: updatedBooks });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while removing the item";
      toast.error(errorMessage);
    } finally {
      set({ isFetching: false });
    }
  }
}));

export const useSettingsStore = create((set, get) => ({
  updateStatus: null,
  isUpdatingSettings: false,
  preferredLanguage: "en",
  setPreferredLanguage: (language) => set({ preferredLanguage: language }),

  updateNotificationSettings: async (settings) => {
    set({ isUpdatingSettings: true });
    try {
      const response = await axiosInstance.post(`/books/notificationSettings/${settings}`);
      set({ updateStatus: response.data });
      const status = get().updateStatus;
      console.log("Updated notification settings: ", status);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating notification settings.";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingSettings: false });
    }
  },
  
  updateLanguageSettings: async (settings) => {
    set({ isUpdatingSettings: true });
    try {
      const response = await axiosInstance.post(`/books/languageSettings/${settings}`);

      if (response.status === 200) {
        set({ preferredLanguage: settings }); // Update Zustand state
        console.log("Language settings updated successfully: ", get().preferredLanguage);
        toast.success("Settings updated successfully!");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred while updating settings.";
      console.log(error);
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingSettings: false });
    }
  },

  getLanguageSettings: async () => {
    try {
      const response = await axiosInstance.get("/books/getLanguageSettings");
      set({ preferredLanguage: response.data.languagePreference }); // Store in Zustand
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error fetching language settings.";
      toast.error(errorMessage);
    }
  }
}));

export const removeAfterTransaction = create((set, get) => ({
  removeBook: async (bookId, userId) => {
    try {
      const response = await axiosInstance.post("/payment/transaction/removeAfterTransaction", { bookId, userId });

      if (response.status === 200) {
        toast.success("Book removed successfully after purchase!");

        await get().updateCartStatus(bookId);
      }
    } catch (error) {
      console.error("Error removing book:", error);
      toast.error("Failed to remove book after transaction.");
    }
  },

  updateCartStatus: async (bookId) => {
    try {
      const response = await axiosInstance.post("/payment/cart/updateSoldStatus", { bookId });

      if (response.status === 200) {
        toast.info("Book marked as Sold in all affected carts.");
      }
    } catch (error) {
      console.error("Error updating cart status:", error);
      toast.error("Failed to update cart status.");
    }
  },
}));

export const useTransactionStore = create((set) => ({
  transactions: [],
  isProcessingPayment: false,

  addTransaction: async (userId, bookId, category, amount, source) => {
    try {
      set({ isProcessingPayment: true });

      const type = category === "SELL" ? "BUY" : "RENT";

      const response = await axiosInstance.post("/payment/transactions/add", {
        userId,
        bookId,
        type,
        amount,
      });

      if (response.status === 200) {
        set((state) => ({
          transactions: [...state.transactions, { userId, bookId, type, amount, date: new Date() }],
          isProcessingPayment: false,
        }));
      }
    } catch (error) {
      console.error("Error adding transaction:", error.response?.data || error.message);
      set({ isProcessingPayment: false });
    }
  },
}));

export const totalTransactions = create((set) => ({
  booksBought: 0,
  booksRented: 0,
  isLoading: false,
  error: null,

  fetchBooksStats: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(`/books/totalTransactions`);
      console.log("bought: ", response.data.booksBought);
      console.log("rented: ", response.data.booksRented);
      set({
        booksBought: response.data.booksBought,
        booksRented: response.data.booksRented,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to fetch books stats", isLoading: false });
    }
  },
}));

export const fetchTransactions = create((set) => ({
  booksBought: [],
  booksRented: [],
  isLoadingBought: false,
  isLoadingRented: false,

  fetchBooksBought: async (userId) => {
    set({ isLoadingBought: true });
    try {
      const { data } = await axiosInstance.post("/books/transactions/bought");
      set({ booksBought: data });
    } catch (error) {
      console.error("Error fetching bought books:", error);
    } finally {
      set({ isLoadingBought: false });
    }
  },
  fetchBooksRented: async (userId) => {
    set({ isLoadingRented: true });
    try {
      const { data } = await axiosInstance.post("/books/transactions/rented");
      set({ booksRented: data });
    } catch (error) {
      console.error("Error fetching rented books:", error);
    } finally {
      set({ isLoadingRented: false });
    }
  },
}));

