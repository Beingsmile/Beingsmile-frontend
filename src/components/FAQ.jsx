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
      answer: (
        <div className="space-y-4">
          <p className="text-gray-600 font-medium leading-relaxed">
            Beingsmile is a commission-free humanitarian sanctuary that connects compassion with legitimate needs. You can launch a mission for any verified cause, share your impactful story, and receive direct gifts from our global community.
          </p>
          <p className="text-gray-600 font-medium leading-relaxed">
            Unique to our mission, we never take a percentage of your raised gifts. 100% of the impact goes directly to the cause (excluding standard secure payment gateway fees).
          </p>
        </div>
      ),
      icon: <FiHelpCircle />
    },
    {
      question: "Why zero commissions on impact?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-600 font-medium leading-relaxed">
            We believe human kindness shouldn't be taxed. Our ecosystem flourishes on voluntary contributions from donors who choose to support Beingsmile's growth while funding specific missions.
          </p>
          <p className="text-gray-600 font-medium leading-relaxed">
            You'll find an optional choice to contribute to Beingsmile during the donation process, helping us maintain this sanctuary for everyone.
          </p>
        </div>
      ),
      icon: <FiActivity />
    },
    {
      question: "How can I fuel the Beingsmile platform?",
      answer: (
        <div className="space-y-4">
          <p className="text-gray-600 font-medium leading-relaxed">
            There are multiple ways to support this sanctuary:
          </p>
          <ul className="ps-5 text-gray-600 font-medium space-y-2 list-disc">
            <li>Include an optional platform gift when supporting any specific mission.</li>
            <li>Directly support our architecture via the <span className="text-primary font-black uppercase tracking-widest text-[10px] border-b border-primary cursor-pointer pb-0.5 ml-1">Support Sanctuary</span> link.</li>
          </ul>
          <p className="text-gray-600 font-medium leading-relaxed">
            These voluntary gifts allow us to innovate and keep the platform accessible for all humanitarian creators.
          </p>
        </div>
      ),
      icon: <FiArrowRight />
    }
  ];

  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans">
            Humanitarian <span className="text-primary">Intelligence</span>
          </h2>
          <p className="text-lg text-gray-500 font-medium leading-relaxed">
            Clear answers for your journey of kindness. Understanding how we protect and amplify impact.
          </p>
        </div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`group bg-neutral rounded-[2.5rem] border-4 transition-all duration-500 overflow-hidden ${activeIndex === index ? "bg-white border-primary shadow-2xl shadow-primary/10 -translate-y-1" : "border-transparent"
                }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-8 md:p-10 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${activeIndex === index ? "bg-primary text-white" : "bg-white text-gray-400"
                    }`}>
                    {item.icon}
                  </div>
                  <span className={`text-xl font-black tracking-tight font-sans transition-colors ${activeIndex === index ? "text-gray-900" : "text-gray-500"
                    }`}>
                    {item.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${activeIndex === index ? "border-primary text-primary rotate-180" : "border-gray-200 text-gray-300"
                  }`}>
                  <FiChevronDown />
                </div>
              </button>

              <div className={`transition-all duration-700 ease-in-out px-8 md:px-10 overflow-hidden ${activeIndex === index ? "max-h-[800px] pb-10 opacity-100" : "max-h-0 opacity-0"
                }`}>
                <div className="md:pl-20 border-t border-gray-100 pt-8">
                  {item.answer}
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
