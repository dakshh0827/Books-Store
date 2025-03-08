import React, { useEffect } from 'react';
import { getBooksToBuy, addToCart } from '../store/useBookStore';
import { useAuthStore } from '../store/useAuthStore.js';
import { useTransactionStore } from '../store/useBookStore.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkout } from '../lib/payment.js';

const BuyBooks = () => {
  const { t } = useTranslation();
  const { authUser } = useAuthStore();
  const { books, isFetchingBooks, booksToBuy } = getBooksToBuy(state => state);
  const { addCart, isAddingToCart } = addToCart();
  const navigate = useNavigate();

  useEffect(() => {
    booksToBuy();
  }, [booksToBuy]);

  const handleAddCartClick = async (event, id) => {
    event.stopPropagation();
    await addCart(id);
  };

  const handlePaymentSuccess = async (book) => {
    await useTransactionStore.getState().addTransaction(authUser._id, book._id, book.category, book.sellingPrice, "buy");
    navigate("/payment/success");
  };

  const handleBuyClick = async (event, book) => {
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
      async () => {
        await handlePaymentSuccess(book);
        navigate("/payment/success");
      }
    );
  };

  const detailClick = (id) => {
    navigate(`/buyBooks/details/${id}`);
  };

  if (isFetchingBooks) {
    return <p>{t('loadingBooks')}</p>;
  }

  return (
    <div className="p-6 mt-16">
      <h2 className="text-3xl font-bold mb-6">{t('booksAvailableToBuy')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="card w-full bg-base-100 shadow-xl flex flex-col h-full cursor-pointer" onClick={() => detailClick(book._id)}>
              <figure className="px-10 pt-10 flex-grow-0">
                <img 
                  src={book.picture || 'https://via.placeholder.com/150'} 
                  alt={book.title} 
                  className="rounded-xl object-cover h-64 w-40 mx-auto" 
                />
              </figure>
              <div className="card-body flex flex-col justify-between flex-grow">
                <h2 className="card-title">{book.title}</h2>
                <p>{book.author}</p>
                <div className="card-actions justify-end mt-auto">
                  <button className="btn btn-primary" onClick={(event) => handleAddCartClick(event, book._id)}>
                    {isAddingToCart ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      t('addToCart')
                    )}
                  </button>
                  <button className="btn btn-primary" onClick={(event) => handleBuyClick(event, book)}>
                    {t('buyFor', { price: book.sellingPrice })}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{t('noBooksAvailable')}</p>
        )}
      </div>
    </div>
  );
};

export default BuyBooks;
