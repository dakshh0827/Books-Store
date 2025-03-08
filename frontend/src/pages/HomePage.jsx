import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex space-x-16">
        <Link to="/buyRentBooks">
          <button className="btn btn-square btn-outline w-96 h-96 flex items-center justify-center">
            <span className="text-4xl font-bold">{t("buyRentBooks")}</span>
          </button>
        </Link>

        <Link to="/buyRentSoftcopies">
          <button className="btn btn-square btn-outline w-96 h-96 flex items-center justify-center">
            <span className="text-4xl font-bold">{t("buyRentSoftcopies")}</span>
          </button>
        </Link>

        <Link to="/lendSellBooks">
          <button className="btn btn-square btn-outline w-96 h-96 flex items-center justify-center">
            <span className="text-4xl font-bold">{t("lendSellBooks")}</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
