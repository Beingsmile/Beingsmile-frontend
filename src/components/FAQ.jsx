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

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`group bg-neutral rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${activeIndex === index ? "bg-white border-primary/20 shadow-md shadow-primary/5" : "border-gray-50 bg-white"
                }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left cursor-pointer transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${activeIndex === index ? "bg-primary text-white" : "bg-primary/5 text-primary"
                    }`}>
                    {item.icon}
                  </div>
                  <span className={`text-lg font-black tracking-tight font-sans transition-colors ${activeIndex === index ? "text-primary" : "text-gray-900"
                    }`}>
                    {item.question}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${activeIndex === index ? "border-primary/30 text-primary rotate-180" : "border-gray-100 text-gray-300"
                  }`}>
                  <FiChevronDown size={18} />
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
