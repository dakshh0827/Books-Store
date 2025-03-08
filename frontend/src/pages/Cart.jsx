import React, { useEffect } from "react";
import { getCartBooks } from "../store/useBookStore";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/useAuthStore.js";
import { useTransactionStore } from "../store/useBookStore.js";
import { checkout } from "../lib/payment.js";

const Cart = () => {
  const { t } = useTranslation();
  const { authUser } = useAuthStore();
  const { books = [], isFetching, getBooks, deleteCartItem } = getCartBooks();
  const navigate = useNavigate();

  useEffect(() => {
    getBooks();
  }, [getBooks]);

  const handlePaymentSuccess = async (book, type) => {
    await useTransactionStore
      .getState()
      .addTransaction(authUser._id, book.bookID, book.category, book[type], "cart");
    navigate("/payment/success");
  };

  const handlePayment = (event, book, type) => {
    event.stopPropagation();

    if (!authUser) {
      alert(t("loginRequired"));
      navigate("/login");
      return;
    }

    checkout.handlePayment(
      book.bookID,
      book[type],
      authUser.fullName,
      authUser.email,
      authUser.phone,
      async () => {
        await handlePaymentSuccess(book, type);
      }
    );
  };

  return (
    <div className="mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4">{t("cartTitle")}</h2>

      {isFetching || books.length === 0 ? (
        <div className="flex justify-center items-center">
          {isFetching ? (
            <Loader className="animate-spin text-primary h-10 w-10" />
          ) : (
            <p className="text-lg">{t("emptyCart")}</p>
          )}
        </div>
      ) : (
        <div>
          {books.map((book) => (
            <div key={book.bookID} className="border p-4 mb-4 rounded-lg flex items-center space-x-4">
              <img src={book.picture} alt={book.title} className="w-16 h-20" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{book.title}</h3>
                <p>{book.author}</p>
              </div>

              <button className="btn btn-danger ml-4" onClick={() => deleteCartItem(book.bookID)}>
                {t("delete")}
              </button>

              {book.sold ? (
                <span className="ml-4 text-red-500 font-semibold text-lg">{t("sold")}</span>
              ) : (
                <>
                  {(book.category === "SELL" || book.category === "BOTH") && (
                    <button className="btn btn-primary ml-4" onClick={(event) => handlePayment(event, book, "sellingPrice")}>
                      {t("buy")}
                    </button>
                  )}
                  {(book.category === "LEND" || book.category === "BOTH") && (
                    <button className="btn btn-secondary ml-4" onClick={(event) => handlePayment(event, book, "lendingPrice")}>
                      {t("rent")}
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
