import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BuyRentBooks = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-16">
        {/* Buy Button */}
        <Link to="/buyBooks">
          <button className="btn btn-square btn-outline w-96 h-96 flex items-center justify-center">
            <span className="text-4xl font-bold">{t("buyButton")}</span>
          </button>
        </Link>

        {/* Rent Button */}
        <Link to="/rentBooks">
          <button className="btn btn-square btn-outline w-96 h-96 flex items-center justify-center">
            <span className="text-4xl font-bold">{t("rentButton")}</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BuyRentBooks;
