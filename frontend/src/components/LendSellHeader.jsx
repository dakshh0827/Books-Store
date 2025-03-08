import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const FormHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-primary p-4 rounded-full">
        <BookOpen className="text-white w-12 h-12" />
      </div>
      <h1 className="mt-4 text-3xl font-bold text-primary">{t("headerText")}</h1>
    </div>
  );
};

export default FormHeader;
