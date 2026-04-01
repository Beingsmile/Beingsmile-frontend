import { useState } from 'react';
import { FiChevronDown, FiHelpCircle, FiArrowRight, FiActivity } from 'react-icons/fi';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does Beingsmile mission architecture work?",
      answer: "Beingsmile is a commission-free humanitarian sanctuary that connects compassion with legitimate needs. You can launch a mission for any verified cause, share your impactful story, and receive direct gifts from our global community. We never take a percentage of your raised gifts.",
      icon: <FiHelpCircle size={16} />
    },
    {
      question: "Why zero commissions on impact?",
      answer: "We believe human kindness shouldn't be taxed. Our ecosystem flourishes on voluntary contributions from donors who choose to support Beingsmile's growth while funding specific missions. You'll find an optional choice to contribute to Beingsmile during the donation process.",
      icon: <FiActivity size={16} />
    },
    {
      question: "How can I fuel the Beingsmile platform?",
      answer: "There are multiple ways to support this sanctuary: Include an optional platform gift when supporting any specific mission, or directly support our architecture via the Support Sanctuary link. These voluntary gifts allow us to innovate and keep the platform accessible for all humanitarian creators.",
      icon: <FiArrowRight size={16} />
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#F0FBF4]">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Humanitarian <em className="not-italic text-[#2D6A4F]">Intelligence</em>
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Clear answers for your journey of kindness.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border overflow-hidden transition-all duration-300 ${
                activeIndex === index
                  ? "border-[#2D6A4F] bg-white shadow-sm"
                  : "border-[#E5F0EA] bg-white"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    activeIndex === index
                      ? "bg-[#2D6A4F] text-white"
                      : "bg-[#F0FBF4] text-[#2D6A4F]"
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${
                    activeIndex === index ? "text-[#2D6A4F]" : "text-gray-800"
                  }`}>
                    {item.question}
                  </span>
                </div>
                <FiChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ml-3 ${
                    activeIndex === index ? "rotate-180 text-[#2D6A4F]" : ""
                  }`}
                />
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index ? "max-h-96 pb-5" : "max-h-0"
              }`}>
                <div className="px-5 pt-1">
                  <div className="ml-11 text-sm text-gray-500 leading-relaxed border-t border-[#E5F0EA] pt-4">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
