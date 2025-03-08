import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="p-10 text-center mt-16">
      <h1 className="text-3xl font-bold text-green-600">{t("paymentSuccessful")}</h1>
      <p className="mt-4">{t("thankYouForPurchase")}</p>
      <button className="btn btn-primary mt-6" onClick={() => navigate("/")}>
        {t("goToHome")}
      </button>
    </div>
  );
};

export default Success;
