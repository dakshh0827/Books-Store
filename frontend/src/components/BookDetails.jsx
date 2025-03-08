import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getBookDetails, addToCart } from "../store/useBookStore.js";
import { useAuthStore } from '../store/useAuthStore.js';
import { checkout } from '../lib/payment.js';
import { useTranslation } from 'react-i18next';

const BookDetails = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const { book, isFetchingDetails, bookDetails } = getBookDetails();
  const { addCart, isAddingToCart } = addToCart();
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    bookDetails(id);
  }, [id, bookDetails]);

  if (isFetchingDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium">{t('loadingBookDetails')}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-medium text-red-500">{t('bookDetailsNotFound')}</p>
      </div>
    );
  }

  const isBuyBooksPage = location.pathname.includes("buyBooks");
  const isRentBooksPage = location.pathname.includes("rentBooks");

  const handleRentClick = (event, book) => {
    event.stopPropagation();

    if (!authUser) {
      alert(t('pleaseLogin'));
      navigate("/login");
      return;
    }

    checkout.handlePayment(
      book._id,
      book.lendingPrice,
      authUser.fullName,
      authUser.email,
      authUser.phone,
      () => navigate("/payment/success")
    );
  };

  const handleBuyClick = (event, book) => {
    event.stopPropagation();

    if (!authUser) {
      alert(t('pleaseLogin'));
      navigate("/login");
      return;
    }

    checkout.handlePayment(
      book._id,
      book.sellingPrice,
      authUser.fullName,
      authUser.email,
      authUser.phone,
      () => navigate("/payment/success")
    );
  };

  const handleAddCartBook = async () => {
    await addCart(id);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-base-200 p-6 mt-16">
      {/* Book Image */}
      <div className="w-full max-w-3xl overflow-hidden mb-6">
        <img
          src={book.picture || "https://via.placeholder.com/600x400"}
          alt={book.title}
          className="rounded-lg shadow-lg w-full max-h-[60vh] object-contain"
        />
      </div>

      {/* Book Details */}
      <div className="w-full max-w-3xl text-center bg-base-100 p-6 rounded-lg shadow-lg flex flex-col justify-between mb-6">
        <h1 className="text-3xl font-bold mb-3">{book.title}</h1>
        <p className="text-lg text-gray-600 mb-3">
          {t('author')}: <span className="font-bold text-gray-700">{book.author}</span>
        </p>
        <p className="text-lg text-gray-600 mb-3">
          {t('edition')}: <span className="font-bold text-gray-700">{book.edition}</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-3xl flex justify-center gap-4">
        {isBuyBooksPage && (
          <>
            <button
              className="btn btn-primary w-2/5"
              onClick={() => handleAddCartBook()}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                t('addToCart')
              )}
            </button>
            <button
              className="btn btn-primary w-2/5"
              onClick={(event) => handleBuyClick(event, book)}
            >
              {t('buyFor')}{book.sellingPrice}
            </button>
          </>
        )}
        {isRentBooksPage && (
          <>
            <button
              className="btn btn-primary w-2/5"
              onClick={() => handleAddCartBook()}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                t('addToCart')
              )}
            </button>
            <button
              className="btn btn-primary w-2/5"
              onClick={(event) => handleRentClick(event, book)}
            >
              {t('rentFor')}{book.lendingPrice}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
