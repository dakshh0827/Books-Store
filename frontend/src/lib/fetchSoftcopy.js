import { create } from "zustand";
import axios from "axios";

export const fetchBooksController = create((set, get) => ({
  isFetchingBooks: false,
  books: [],
  softcopy: null,

  fetchBooks: async (title = "novels") => {
    try {
      set({ isFetchingBooks: true });
      const response = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
      const resBooks = response.data.docs;
      set({ books: resBooks });

      console.log("Books Found:", resBooks);
      return resBooks;
    } catch (error) {
      console.error("Error fetching books:", error.message);
      return [];
    } finally {
      set({ isFetchingBooks: false });
    }
  },

  getSoftcopyDetails: async (id) => {
    try {
      set({ isFetchingBooks: true });

      // Fetch book details from OpenLibrary
      const response = await axios.get(`https://openlibrary.org/works/${id}.json`);
      const book = response.data;

      // Fetch author name separately
      let author = "Unknown Author";
      if (book.authors && book.authors.length > 0) {
        const authorId = book.authors[0].author.key.split("/").pop();
        const authorResponse = await axios.get(`https://openlibrary.org/authors/${authorId}.json`);
        author = authorResponse.data.name || "Unknown Author";
      }

      // Get cover image
      const coverImage = book.covers
        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
        : "https://via.placeholder.com/600x400";

      // Construct formatted book details
      const formattedBook = {
        title: book.title || "No Title",
        author,
        edition: book.edition_name || "Not Available",
        picture: coverImage,
        downloadLink: `https://openlibrary.org${book.key}.pdf`,
      };

      set({ softcopy: formattedBook });
      return formattedBook; // Return softcopy so component can use it immediately
    } catch (error) {
      console.error("Error fetching book details:", error);
      set({ softcopy: null });
      return null;
    } finally {
      set({ isFetchingBooks: false });
    }
  },

  getSoftcopy: () => get().softcopy,
}));
