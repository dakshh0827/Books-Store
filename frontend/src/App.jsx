import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LogInPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import BookDetails from "./components/BookDetails";
import Cart from "./pages/Cart";
import Success from "./components/PaymentSuccess.jsx";

import BuyRentBooks from "./components/BuyRentBooks";
import BuyBooks from "./components/BuyBooks";
import RentBooks from "./components/RentBooks";
import LendSellBooks from "./components/LendSellBooks";
import BuyRentSoftcopies from "./components/BuyRentSoftcopies";
import SoftcopyDetails from "./components/softcopyDetails.jsx"; 
import BooksBought from "./components/BooksBought.jsx";
import BooksRented from "./components/BooksRented.jsx";

import i18n from './lib/i18n';
import { updateAppLanguage } from "./lib/i18n.js";
import { I18nextProvider } from 'react-i18next';
import { useSettingsStore } from "./store/useBookStore.js";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const { preferredLanguage, getLanguageSettings } = useSettingsStore();

  const [isLoadingLanguage, setIsLoadingLanguage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLanguageSettings = async () => {
      await getLanguageSettings();
      updateAppLanguage(preferredLanguage);
      setIsLoadingLanguage(false);
    };
    loadLanguageSettings();
  }, [getLanguageSettings]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (isLoadingLanguage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {isLoadingLanguage || isCheckingAuth ? (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      ) : (
        <div data-theme={theme}>
          {authUser && <Navbar />}
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
            <Route path="/cart" element={authUser ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

            <Route path="/buyRentBooks" element={authUser ? <BuyRentBooks /> : <Navigate to="/login" />} />
            <Route path="/buyBooks" element={authUser ? <BuyBooks /> : <Navigate to="/login" />} />
            <Route path="/rentBooks" element={authUser ? <RentBooks /> : <Navigate to="/login" />} />
            <Route path="/lendSellBooks" element={authUser ? <LendSellBooks /> : <Navigate to="/login" />} />
            <Route path="/buyRentSoftcopies" element={authUser ? <BuyRentSoftcopies /> : <Navigate to="/login" />} />
            <Route path="/buyRentSoftcopy/details/:id" element={authUser ? <SoftcopyDetails /> : <Navigate to="/login" />} />

            <Route path="/buyBooks/details/:id" element={authUser ? <BookDetails /> : <Navigate to="/login" />} />
            <Route path="/rentBooks/details/:id" element={authUser ? <BookDetails /> : <Navigate to="/login" />} />
            
            <Route path="/payment/success" element={authUser ? <Success /> : <Navigate to="/login" />} />

            <Route path="/profile/transactions/bought" element={authUser ? <BooksBought /> : <Navigate to="/login" />} />
            <Route path="/profile/transactions/rented" element={authUser ? <BooksRented /> : <Navigate to="/login" />} />
          </Routes>

          <Toaster />
        </div>
      )}
    </I18nextProvider>
  );
};

export default App;
