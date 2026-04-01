import { useTranslation } from "react-i18next";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { Dropdown } from "flowbite-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language || "en";

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  ];

  return (
    <div className="flex items-center">
      <Dropdown
        arrowIcon={false}
        inline
        label={
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group">
            <FiGlobe className="text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-primary">
              {currentLanguage === "en" ? "EN" : "BN"}
            </span>
          </button>
        }
      >
        <div className="p-2 w-40 space-y-1">
            <p className="px-2 pb-1 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Select Language</p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                currentLanguage.startsWith(lang.code)
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage.startsWith(lang.code) && <FiCheck size={12} />}
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;
