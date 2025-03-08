import React, { useEffect } from "react";
import { fetchTransactions } from "../store/useBookStore.js";
import { useTranslation } from "react-i18next";

const BooksBoughtList = ({ userId }) => {
  const { t } = useTranslation();
  const { booksBought, fetchBooksBought } = fetchTransactions();

  useEffect(() => {
    fetchBooksBought(userId);
  }, [userId]);

  return (
    <div className="p-4 mt-16">
      <h2 className="text-xl font-semibold mb-4">{t("booksBoughtTitle")}</h2>
      {booksBought.length === 0 ? (
        <p>{t("booksBoughtNoBooks")}</p>
      ) : (
        <ol className="list-decimal pl-5">
          {booksBought
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date (latest first)
            .map((book) => (
              <li key={book.id.toString()} className="mb-2 p-2 border-b">
                <strong>{book.title}</strong>
                <br />
                <span>{t("booksBoughtAuthor")}: {book.author}</span>
                <br />
                <span>{t("booksBoughtEdition")}: {book.edition}</span>
                <br />
                <span>{t("booksBoughtPrice")}: ${book.amount}</span>
                <br />
                <span>{t("booksBoughtDate")}: {new Date(book.date).toLocaleDateString()}</span>
              </li>
            ))}
        </ol>
      )}
    </div>
  );
};

export default BooksBoughtList;
