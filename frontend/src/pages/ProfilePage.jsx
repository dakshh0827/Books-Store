import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { totalTransactions } from "../store/useBookStore.js";
import { Camera, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { authUser, logout, isUpdatingProfile, updateProfile, updatePhone, updateAddress } = useAuthStore();
  const { booksBought, booksRented, fetchBooksStats } = totalTransactions();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [view, setView] = useState("profile");

  useEffect(() => {
    fetchBooksStats(authUser._id);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleAddressUpdate = async () => {
    if (newAddress) {
      await updateAddress({ address: newAddress });
      setIsAddressModalOpen(false);
    }
  };

  const handlePhoneUpdate = async () => {
    if (newPhone) {
      await updatePhone({ phone: newPhone });
      setIsPhoneModalOpen(false);
    }
  };

  useEffect(() => {
    if (authUser?.profilePic) {
      setSelectedImg(authUser.profilePic);
    }
  }, [authUser]);

  return (
    <div className="p-6 bg-base-200 min-h-screen mt-16">
      {view === "profile" && (
        <div className="w-full max-w-full mx-auto bg-base-100 p-8 rounded-lg shadow-md">
          <div className="flex mb-6 justify-start relative">
            <div className="relative">
              {isUpdatingProfile && (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 rounded-full z-10">
                  <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover"
              />
              <label htmlFor="file-upload" className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer">
                <Camera color="white" />
              </label>
              <input type="file" id="file-upload" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{authUser?.fullName || "Name"}</h2>
            <div className="flex items-center text-gray-600 mb-4">
              <Mail className="mr-2" />
              <p>{authUser?.email || "johndoe@example.com"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{t("contactInfo")}</h3>
            <div className="flex items-center text-gray-600 mb-3">
              <Phone className="mr-2" />
              <p>{authUser?.phone || t("notProvided")}</p>
              <button className="btn btn-accent ml-4" onClick={() => setIsPhoneModalOpen(true)}>
                {t("updatePhone")}
              </button>
            </div>

            <div className="flex items-center text-gray-600 mb-3">
              <User className="mr-2" />
              <p>{authUser?.address || t("noAddressProvided")}</p>
              <button className="btn btn-accent ml-4" onClick={() => setIsAddressModalOpen(true)}>
                {t("updateAddress")}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">{t("yourOrders")}</h3>
            <div className="flex text-gray-600">
              <div className="flex-1 text-left">
                <Link to="/profile/transactions/bought" className="text-lg font-semibold cursor-pointer text-primary">
                  {booksBought}
                </Link>
                <p className="text-sm">{t("booksBought")}</p>
              </div>
              <div className="flex-1 text-left">
                <Link to="/profile/transactions/rented" className="text-lg font-semibold cursor-pointer text-primary">
                  {booksRented}
                </Link>
                <p className="text-sm">{t("booksRented")}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-start gap-4 mt-6">
            <button className="btn btn-secondary" onClick={logout}>
              {t("logout")}
            </button>
          </div>
        </div>
      )}

      {isAddressModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">{t("updateAddressModalTitle")}</h3>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              placeholder={t("updateAddressPlaceholder")}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            ></textarea>
            <div className="flex justify-between">
              <button className="btn btn-accent" onClick={handleAddressUpdate}>
                {t("save")}
              </button>
              <button className="btn btn-outline" onClick={() => setIsAddressModalOpen(false)}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {isPhoneModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-semibold mb-4">{t("updatePhoneModalTitle")}</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder={t("updatePhonePlaceholder")}
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <div className="flex justify-between">
              <button className="btn btn-accent" onClick={handlePhoneUpdate}>
                {t("save")}
              </button>
              <button className="btn btn-outline" onClick={() => setIsPhoneModalOpen(false)}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
