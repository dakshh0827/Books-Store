import { THEMES } from "../constants/themes.js";
import { useThemeStore } from "../store/useThemeStore.js";
import { useState, useEffect } from "react";
import { useSettingsStore } from "../store/useBookStore.js";
import { useTranslation } from "react-i18next";
import { Loader } from "lucide-react";
import { updateAppLanguage } from "../lib/i18n.js";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { preferredLanguage, updateLanguageSettings, getLanguageSettings, setPreferredLanguage } = useSettingsStore();
  const { updateNotificationSettings, isUpdatingNotifications } = useSettingsStore();

  const { t } = useTranslation();

  // Load preferred language on mount
  const [language, setLanguage] = useState(preferredLanguage || "en");
  const [notifications, setNotifications] = useState({ dailyNotifications: true });

  useEffect(() => {
    // Fetch user's preferred language from Zustand store
    getLanguageSettings();
    setLanguage(preferredLanguage);
  }, [preferredLanguage]);

  const handleSaveSettings = async () => {
    try {
      await updateNotificationSettings(notifications.dailyNotifications);
      await updateLanguageSettings(language);

      // Update i18n only after saving
      updateAppLanguage(language);
      setPreferredLanguage(language);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Theme Selector */}
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{t("theme")}</h2>
            <p className="text-sm text-base-content/70">
              Choose a theme for your chat interface
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                  theme === t ? "bg-base-200" : "hover:bg-base-200/50"
                }`}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("language")}</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="select select-bordered"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("notifications")}</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notifications.dailyNotifications}
              onChange={() => setNotifications((prev) => ({ dailyNotifications: !prev.dailyNotifications }))}
              className="toggle toggle-primary"
            />
            <span>{t("dailyNotifications")}</span>
          </label>
        </div>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSaveSettings}
            className="btn btn-primary btn-block flex items-center justify-center gap-2"
            disabled={isUpdatingNotifications}
          >
            {isUpdatingNotifications ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                {t("save")}
              </>
            ) : (
              t("save")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
