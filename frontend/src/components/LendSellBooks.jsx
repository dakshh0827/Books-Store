import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, IndianRupee, BookOpen, User, Image } from "lucide-react";
import { toast } from "react-hot-toast";
import LendSellHeader from "./LendSellHeader.jsx";
import { addBookStore } from "../store/useBookStore.js";
import { axiosInstance } from "../lib/axios.js";

const LendSell = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    category: "lend",
    author: "",
    edition: "",
    lendingPrice: "",
    sellingPrice: "",
    picture: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { addBook } = addBookStore();
  const fileInputRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const validateForm = () => {
    if (!formData.title.trim()) return toast.error(t("validation.titleRequired"));
    if (!formData.author.trim()) return toast.error(t("validation.authorRequired"));
    if (formData.category === "lend" && !formData.lendingPrice.trim())
      return toast.error(t("validation.lendingPriceRequired"));
    if (formData.category === "sell" && !formData.sellingPrice.trim())
      return toast.error(t("validation.sellingPriceRequired"));
    if (formData.category === "both" && (!formData.lendingPrice.trim() || !formData.sellingPrice.trim()))
      return toast.error(t("validation.bothPriceRequired"));

    return true;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const response = await axiosInstance.post("/books/upload", { image: reader.result });
        setFormData((prev) => ({ ...prev, picture: response.data.url }));
        setUploadedFileName(response.data.url);
        toast.success(t("uploadSuccess"));
      } catch (error) {
        toast.error(t("uploadError"));
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset input on failure
        }
      } finally {
        setIsUploadingImage(false);
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      addBook(formData)
        .catch(() => toast.error(t("submitError")))
        .finally(() => {
          setIsSubmitting(false);
          setFormData({ title: "", category: "lend", author: "", edition: "", lendingPrice: "", sellingPrice: "", picture: "" });
          setUploadedFileName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="grid gap-6 max-w-4xl w-full">
        <LendSellHeader />

        {/* Title and Category */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t("title")}</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder={t("titlePlaceholder")}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t("category")}</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="lend">{t("lend")}</option>
              <option value="sell">{t("sell")}</option>
            </select>
          </div>
        </div>

        {/* Author and Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t("author")}</span>
            </label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder={t("authorPlaceholder")}
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          {formData.category === "lend" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("lendingPrice")}</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <input
                  type="number"
                  className="input input-bordered w-full pl-10"
                  placeholder="00"
                  value={formData.lendingPrice}
                  onChange={(e) => setFormData({ ...formData, lendingPrice: e.target.value })}
                />
              </div>
            </div>
          )}

          {formData.category === "sell" && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t("sellingPrice")}</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                <input
                  type="number"
                  className="input input-bordered w-full pl-10"
                  placeholder="00"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Edition and Picture */}
        <div className="grid grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t("edition")}</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="2024"
              value={formData.edition}
              onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
            />
          </div>

          <div className="form-control">
            <label className="label flex items-center gap-2">
              {/* <Image className="w-5 h-5 text-base-content/40" /> */}
              <span className="label-text font-medium">{t("bookPicture")}</span>
            </label>
            <input ref={fileInputRef} type="file" className="file-input file-input-bordered w-full" onChange={handleFileUpload} />
            {isUploadingImage && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="animate-spin w-12 h-12 text-white" />
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} onClick={handleSubmit}>
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : t("submit")}
        </button>
      </div>
    </div>
  );
};

export default LendSell;
