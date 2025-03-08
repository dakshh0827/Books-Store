import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchBooksController } from "../lib/fetchSoftcopy.js";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const SoftcopyDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getSoftcopyDetails, getSoftcopy, isFetchingBooks } = fetchBooksController();

  useEffect(() => {
    getSoftcopyDetails(id);
  }, [id, getSoftcopyDetails]);

  const softcopy = getSoftcopy();

  if (isFetchingBooks) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-16">
        <LoaderCircle className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!softcopy) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-16">
        <p className="text-xl font-medium text-red-500">{t("softcopyNotFound")}</p>
      </div>
    );
  }

  const handleReadBook = () => {
    const openLibraryUrl = `https://openlibrary.org/works/${id}`;
    window.open(openLibraryUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-base-200 p-6 mt-16">
      {/* Book Image */}
      <div className="w-full max-w-2xl overflow-hidden mb-6">
        <img
          src={softcopy.picture || "https://via.placeholder.com/600x800"}
          alt={softcopy.title}
          className="rounded-lg shadow-lg w-full max-h-[55vh] object-contain"
        />
      </div>

      {/* Book Details */}
      <div className="w-full max-w-2xl text-center bg-base-100 p-6 rounded-lg shadow-lg flex flex-col justify-between mb-6">
        <h1 className="text-3xl font-bold mb-3">{softcopy.title}</h1>
        <p className="text-lg text-gray-600 mb-2">
          {t("author")}: <span className="font-bold text-gray-700">{softcopy.author}</span>
        </p>
        <p className="text-lg text-gray-600 mb-2">
          {t("edition")}: <span className="font-bold text-gray-700">{softcopy.edition}</span>
        </p>
      </div>

      {/* Button */}
      <div className="w-full max-w-2xl flex justify-center">
        <button className="btn btn-primary w-1/4" onClick={handleReadBook}>
          {t("read")}
        </button>
      </div>
    </div>
  );
};

export default SoftcopyDetails;
