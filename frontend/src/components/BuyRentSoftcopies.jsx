import React, { useEffect, useState } from "react";
import { fetchBooksController } from "../lib/fetchSoftcopy.js";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

const BuyRentSoftcopies = () => {
  const { fetchBooks, isFetchingBooks } = fetchBooksController();
  const [searchQuery, setSearchQuery] = useState("");
  const [booksGot, setBooksGot] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const fetchedBooks = await fetchBooks(searchQuery);
    setBooksGot(fetchedBooks);
  };

  useEffect(() => {
    const getBooks = async () => {
      const fetchedBooks = await fetchBooks("novels") // Default fetch
      setBooksGot(fetchedBooks);
    };
    getBooks();
  }, []);

  return (
    <div className="p-6 bg-base-200 min-h-screen mt-16">

      {/* Search Bar */}
      <div className="mb-6 flex justify-center gap-3">
        <input
          type="text"
          placeholder="Enter book title..."
          className="input input-bordered w-full max-w-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {isFetchingBooks && (
        <div className="flex justify-center items-center my-10">
          <LoaderCircle className="animate-spin w-12 h-12 text-primary" />
        </div>
      )}

      {/* Display Books */}
      {!isFetchingBooks && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {booksGot.length > 0 ? (
            booksGot.map((book, index) => {
              const coverUrl = book.cover_edition_key
                ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
                : "https://via.placeholder.com/128x192.png?text=No+Cover"; // Placeholder image

              return (
                <div
                  key={index}
                  className="card w-full bg-base-100 shadow-xl flex flex-col h-full cursor-pointer"
                  onClick={() => navigate(`/buyRentSoftcopy/details/${book.key.replace("/works/", "")}`)}
                >
                  <figure className="p-4 flex justify-center">
                    <img
                      src={coverUrl}
                      alt={book.title}
                      className="h-64 w-44 object-cover rounded-lg" 
                    />
                  </figure>
                  <div className="card-body flex flex-col justify-between flex-grow">
                    <h2 className="card-title text-lg font-semibold">{book.title}</h2>
                    <p className="text-gray-600 text-sm">{book.author_name?.[0] || "Unknown"}</p>
                    <p className="text-gray-500 text-sm">{book.first_publish_year || "N/A"}</p>
                    <div className="card-actions justify-end mt-auto">
                      <button className="btn btn-primary" onClick={() => navigate(`/buyRentSoftcopy/details/${book.key.replace("/works/", "")}`)}>View Details</button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-lg font-medium text-gray-700 w-full">
              No books found. Try another search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BuyRentSoftcopies;
