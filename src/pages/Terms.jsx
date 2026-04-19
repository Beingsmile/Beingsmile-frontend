import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FiShield, FiCheckCircle, FiInfo, FiLayers, FiLock, FiClock } from "react-icons/fi";

const Terms = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: "integrity",
      icon: <FiCheckCircle className="text-emerald-500" />,
      title: t("terms.donation_title"),
      content: t("terms.donation_p1"),
    },
    {
      id: "responsibility",
      icon: <FiLayers className="text-blue-500" />,
      title: t("terms.responsibility_title"),
      content: t("terms.responsibility_p1"),
    },
    {
      id: "transparency",
      icon: <FiInfo className="text-amber-500" />,
      title: t("terms.transparency_title"),
      content: t("terms.transparency_p1"),
    },
    {
      id: "privacy",
      icon: <FiLock className="text-indigo-500" />,
      title: t("terms.privacy_title"),
      content: t("terms.privacy_p1"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FDFB] pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
            <FiShield size={12} /> Legal Framework
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase mb-4 leading-none">
            {t("terms.title")}
          </h1>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <FiClock size={14} /> {t("terms.last_updated")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Navigation Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-32 h-fit space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Navigation</p>
            {sections.map((s) => (
              <a 
                key={s.id} 
                href={`#${s.id}`}
                className="block px-4 py-2 text-[11px] font-bold text-gray-500 hover:text-[#2D6A4F] hover:bg-emerald-50 rounded-lg transition-all"
              >
                {s.title}
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Intro Card */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-[2rem] border border-emerald-50 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2D6A4F]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <h2 className="text-xl font-black text-[#0f2418] uppercase tracking-tight mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center">
                  ✨
                </span>
                {t("terms.intro_title")}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm font-medium italic">
                {t("terms.intro_p1")}
              </p>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-6">
              {sections.map((section, idx) => (
                <motion.div 
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group"
                >
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-neutral rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                        {section.icon}
                      </div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm font-medium">
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Support Box */}
            <div className="p-8 bg-[#1B4332] rounded-[2.5rem] text-white text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h2 className="text-xl font-black uppercase tracking-tight mb-2">Have questions?</h2>
                 <p className="text-emerald-100/70 text-xs font-bold mb-6">Our legal team is here to help you understand your rights.</p>
                 <a 
                   href="/contact-us" 
                   className="inline-flex items-center px-8 py-3 bg-white text-[#1B4332] rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all"
                 >
                   Reach Out
                 </a>
               </div>
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
