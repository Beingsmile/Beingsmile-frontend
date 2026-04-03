import { Link, useOutletContext } from "react-router";
import heroImage from "../assets/hero.jpg";
import { AuthContext } from "../contexts/AuthProvider";
import { useContext } from "react";
import { FiArrowRight, FiHeart, FiCheckCircle, FiCamera } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { setAuth } = useOutletContext();

  return (
    <section className="relative bg-[#F0FBF4] overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
      {/* Subtle decorative dots */}
      <div className="absolute top-12 right-0 w-72 h-72 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, #2D6A4F 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl xl:text-[3.5rem] font-bold text-[#0f2418] leading-[1.15]">
              {t("hero.title_healing")}{" "}
              <span className="text-[#2D6A4F]">{t("hero.title_lives")}</span>{" "}
              <br className="hidden md:block" />
              {t("hero.title_starting")} {t("hero.title_your")} <em className="not-italic font-black">{t("hero.title_smile")}</em>
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-lg font-medium">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Link
                to="/campaigns/browse"
                className="btn-primary text-sm"
              >
                <FiHeart size={15} />
                {t("hero.be_a_donor")}
              </Link>

              {user ? (
                <Link
                  to="/campaigns/create"
                  className="btn-outline text-sm"
                >
                  {t("hero.start_a_mission")}
                  <FiArrowRight size={15} />
                </Link>
              ) : (
                <button
                  onClick={() => setAuth("login")}
                  className="btn-outline text-sm"
                >
                  {t("hero.start_a_mission")}
                  <FiArrowRight size={15} />
                </button>
              )}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {[
                { label: "100% Transparent", icon: <FiCheckCircle size={13} /> },
                { label: "Zero Commission", icon: <FiCheckCircle size={13} /> },
                { label: "Verified Missions", icon: <FiCheckCircle size={13} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <span className="text-[#2D6A4F]">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo Card — styled like the reference */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main card */}
            <div className="relative w-72 sm:w-80 lg:w-96">
              {/* Green card frame */}
              <div className="relative rounded-2xl overflow-hidden border-4 border-[#2D6A4F] shadow-xl">
                <img
                  src={heroImage}
                  alt="Humanitarian Impact"
                  className="w-full aspect-[3/4] object-cover"
                />
                {/* Bottom overlay with text */}
                <div className="absolute bottom-0 left-0 right-0 bg-[#1B4332]/90 p-4">
                  <p className="text-white text-xs font-semibold opacity-80">গণতন্ত্র উদ্যোগ</p>
                  <p className="text-white text-sm font-bold mt-0.5">BeingSmile — মানুষের পাশে আছি</p>
                </div>
              </div>

              {/* Camera badge */}
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#2D6A4F] rounded-xl flex items-center justify-center shadow-lg">
                <FiCamera className="text-white" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
