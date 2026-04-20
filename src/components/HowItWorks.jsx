import { FiUserPlus, FiSearch, FiShield, FiHeart } from "react-icons/fi";
import { Link } from "react-router";

const steps = [
  {
    icon: <FiUserPlus size={22} />,
    step: 1,
    title: "ছবি তুলুন",
    en: "Create Profile",
    text: "Sign up as a donor to spread joy, or as a fundraiser to find a path forward.",
    link: "/campaigns/browse",
  },
  {
    icon: <FiSearch size={22} />,
    step: 2,
    title: "ত্রাণ তহবিল করুন",
    en: "Start a Mission",
    text: "Submit your verified cause, share your story, and launch your humanitarian campaign.",
    link: "/campaigns/create",
  },
  {
    icon: <FiHeart size={22} />,
    step: 3,
    title: "শেয়ার করুন",
    en: "Share & Grow",
    text: "Share your mission with your network and watch your community come together.",
    link: "/campaigns/browse",
  },
  {
    icon: <FiShield size={22} />,
    step: 4,
    title: "অনুদান পাবেন",
    en: "Receive Donations",
    text: "Receive verified donations directly, with 100% transparency and zero platform commissions.",
    link: "/contact-us",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-[#F0FBF4]">
      <div className="max-w-7xl mx-auto">
        {/* Section header — centered */}
        <div className="text-center mb-14 space-y-3">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            কীভাবে কাজ করে
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Starting a fundraiser or making a donation is a simple 4-step process designed for real impact.
          </p>
        </div>

        {/* 4-column horizontal steps — like reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="group flex flex-col items-center text-center space-y-4">
              {/* Icon circle with step badge */}
              <div className="relative">
                <div className="w-16 h-16 bg-white rounded-full border border-[#D1EAD9] flex items-center justify-center text-[#2D6A4F] group-hover:bg-[#2D6A4F] group-hover:text-white group-hover:border-[#2D6A4F] transition-all duration-300 shadow-sm">
                  {step.icon}
                </div>
                {/* Number badge */}
                <div className="step-badge">{step.step}</div>
              </div>

              {/* Text */}
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800 leading-snug">{step.title}</h4>
                <p className="text-xs text-[#2D6A4F] font-semibold">{step.en}</p>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed px-1">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
