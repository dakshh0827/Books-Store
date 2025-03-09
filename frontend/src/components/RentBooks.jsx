import React, { useEffect } from "react";
import { getBooksToRent, addToCart } from "../store/useBookStore";
import { useAuthStore } from "../store/useAuthStore.js";
import { useTransactionStore } from "../store/useBookStore.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { checkout } from "../lib/payment.js";
import { Loader } from "lucide-react";

const RentBooks = () => {
  const { t } = useTranslation();
  const { authUser } = useAuthStore();
  const { books, isFetchingBooks, booksToRent } = getBooksToRent(state => state);
  const { addCart, isAddingToCart } = addToCart();
  const { isProcessingPayment, addTransaction } = useTransactionStore();
  const navigate = useNavigate();

  useEffect(() => {
    booksToRent();
  }, [booksToRent]);

  const handlePaymentSuccess = async (book) => {
    await addTransaction(authUser._id, book._id, book.category, book.lendingPrice, "rent");
    navigate("/payment/success");
  };

  const handleRentClick = async (event, book) => {
    event.stopPropagation();

    if (!authUser) {
      alert(t("pleaseLogin"));
      navigate("/login");
      return;
    }

    checkout.handlePayment(
      book._id,
      book.lendingPrice,
      authUser.fullName,
      authUser.email,
      authUser.phone,
      async () => {
        await handlePaymentSuccess(book);
      }
    );
  };

  if (isFetchingBooks || isProcessingPayment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin text-blue-500 w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="p-6 mt-16">
      <h2 className="text-3xl font-bold mb-6">{t("booksAvailableToRent")}</h2>
      <h4 className="text-1xl mb-6">{t("Note: Rental period is 14 days")}</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book._id}
              className="card w-full bg-base-100 shadow-xl flex flex-col h-full cursor-pointer"
              onClick={() => navigate(`/rentBooks/details/${book._id}`)}
            >
              <figure className="px-10 pt-10 flex-grow-0">
                <img
                  src={book.picture || "https://via.placeholder.com/150"}
                  alt={book.title}
                  className="rounded-xl object-cover h-64 w-40 mx-auto"
                />
              </figure>
              <div className="card-body flex flex-col justify-between flex-grow">
                <h2 className="card-title">{book.title}</h2>
                <p>{book.author}</p>
                <div className="card-actions justify-end mt-auto">
                  {book.status === "Rented" ? (
                    <span className="text-red-500 font-bold">{t("rented")}</span>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          addCart(book._id);
                        }}
                      >
                        {isAddingToCart ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          t("addToCart")
                        )}
                      </button>
                      <button className="btn btn-primary" onClick={(event) => handleRentClick(event, book)}>
                        {t("rentFor")} {book.lendingPrice}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{t("noBooksAvailable")}</p>
        )}
      </div>
    </div>
  );
};

export default RentBooks;
