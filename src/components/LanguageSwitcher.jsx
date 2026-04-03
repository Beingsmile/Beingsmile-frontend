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
        theme={{
          floating: {
            base: "z-10 w-fit rounded-xl shadow-xl border border-gray-100 bg-white backdrop-blur-md focus:outline-none",
            content: "rounded-xl py-0",
            style: {
                dark: "bg-white text-gray-900 border-gray-100",
                light: "bg-white text-gray-900 border-gray-100",
                auto: "bg-white text-gray-900 border-gray-100"
            }
          }
        }}
        label={
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group">
            <FiGlobe className="text-gray-400 group-hover:text-emerald-600 transition-colors" size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-emerald-700">
              {currentLanguage === "en" ? "EN" : "BN"}
            </span>
          </button>
        }
      >
        <div className="p-2 w-44 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100/50 mb-1">
            Choose Language
          </p>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                currentLanguage.startsWith(lang.code)
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm grayscale-[0.2]">{lang.flag}</span>
                <span className={currentLanguage.startsWith(lang.code) ? "text-emerald-700" : "text-gray-600"}>
                    {lang.name}
                </span>
              </div>
              {currentLanguage.startsWith(lang.code) && (
                <div className="w-5 h-5 flex items-center justify-center bg-emerald-100 rounded-full">
                  <FiCheck size={10} className="text-emerald-600" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;
