import { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
  {
    question: "How does BeingSmile work?",
    answer: (
      <>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          BeingSmile is a commission-free crowdfunding platform that connects people who want to help with those who need support. You can create a campaign for any legitimate cause, share your story, and receive donations directly.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Unlike other platforms, we never take a percentage of your funds. 100% of what you raise goes to your cause (minus standard payment processing fees).
        </p>
      </>
    ),
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )
  },
  {
    question: "Why don't you take commissions?",
    answer: (
      <>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          We believe in keeping funds where they belong - with the people who need them. Our model relies on voluntary contributions from donors who want to support both campaigns and our platform's operations.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          You'll see an optional option to donate to BeingSmile when contributing to any campaign. This helps us maintain and improve the platform while keeping it free for campaigners.
        </p>
      </>
    ),
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )
  },
  {
    question: "How can I donate to BeingSmile?",
    answer: (
      <>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          There are two ways to support BeingSmile:
        </p>
        <ul className="ps-5 text-gray-600 dark:text-gray-300 list-disc mb-2">
          <li>When donating to any campaign, you'll see an optional checkbox to add a small contribution to BeingSmile</li>
          <li>Visit our <a href="/support-us" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Support Us</a> page to make a direct donation</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          These voluntary contributions help us maintain the platform, develop new features, and keep our services free for everyone.
        </p>
      </>
    ),
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )
  },
  {
    question: "What payment methods do you accept?",
    answer: (
      <>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers in select countries.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Payment processing fees (typically 2.9% + $0.30 per transaction) are the only fees deducted from contributions. These go directly to our payment partners, not to BeingSmile.
        </p>
      </>
    ),
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )
  },
  {
    question: "How do I know my donation reaches the right place?",
    answer: (
      <>
        <p className="mb-2 text-gray-600 dark:text-gray-300">
          We verify all campaign organizers and provide transparency tools:
        </p>
        <ul className="ps-5 text-gray-600 dark:text-gray-300 list-disc mb-2">
          <li>Identity verification for campaign creators</li>
          <li>Regular updates from campaigners</li>
          <li>Withdrawal verification process</li>
        </ul>
        <p className="text-gray-600 dark:text-gray-300">
          While we can't guarantee how funds are ultimately used, we have systems in place to help ensure funds go to legitimate needs.
        </p>
      </>
    ),
    icon: (
      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        <path d="M10 12a1 1 0 100-2 1 1 0 000 2zm0-4a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
    )
  }
];

  return (
    <div className="max-w-4xl mx-4 md:mx-auto my-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              type="button"
              className={`flex items-center justify-between w-full p-5 font-medium text-left transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`faq-${index}`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.question}</span>
              </div>
              <svg
                className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              id={`faq-${index}`}
              className={`transition-all duration-300 overflow-hidden ${
                activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;