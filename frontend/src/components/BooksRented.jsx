import React, { useEffect } from "react";
import { fetchTransactions } from "../store/useBookStore.js";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";

const BooksRentedList = ({ userId }) => {
  const { t } = useTranslation();
  const { booksRented, fetchBooksRented, isLoadingRented } = fetchTransactions();

  useEffect(() => {
    fetchBooksRented(userId);
  }, [userId]);

  return (
    <div className="p-4 mt-16 relative">
      <h2 className="text-xl font-semibold mb-4">{t("booksRentedTitle")}</h2>

      {isLoadingRented ? (
        <div className="flex items-center justify-center h-40">
          <Loader className="animate-spin text-blue-500 w-10 h-10" />
        </div>
      ) : booksRented.length === 0 ? (
        <p>{t("booksRentedNoBooks")}</p>
      ) : (
        <ol className="list-decimal pl-5">
          {booksRented.map((book, index) => (
            <li key={book.id.toString()} className="mb-2 p-2 border-b">
              <strong>{index + 1}. {book.title}</strong>
              <br />
              <span>{t("booksRentedAuthor")}: {book.author}</span>
              <br />
              <span>{t("booksRentedEdition")}: {book.edition}</span>
              <br />
              <span>{t("booksRentedPrice")}: ${book.amount}</span>
              <br />
              <span>{t("booksRentedDate")}: {new Date(book.date).toLocaleDateString()}</span>
              <br />
              <span>
                <strong>{t("booksRentedDueDate")}:</strong> {new Date(book.dueDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default BooksRentedList;
