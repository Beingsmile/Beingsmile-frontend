const features = [
  {
    title: "Zero Platform Fees",
    desc: "100% of your donation goes to the campaign. We never take a cut.",
    icon: "💸",
  },
  {
    title: "Trusted & Verified Campaigns",
    desc: "Every campaign is reviewed to ensure authenticity and impact.",
    icon: "✅",
  },
  {
    title: "Support bKash, SSLCommerz & Stripe",
    desc: "Multiple secure payment options trusted by millions.",
    icon: "💳",
  },
  {
    title: "Track Your Transactions",
    desc: "View your complete donation and withdrawal history in one place.",
    icon: "📂",
  },
  {
    title: "Powerful Sharing Tools",
    desc: "Boost visibility by sharing campaigns across WhatsApp, Facebook, and more.",
    icon: "📤",
  },
  {
    title: "Affordable for All",
    desc: "No hidden fees. Optional support helps us grow sustainably.",
    icon: "🏷️",
  },
  {
    title: "Your Data is Safe",
    desc: "We prioritize privacy and never sell your personal data.",
    icon: "🔐",
  },
  {
    title: "Community & Cause Driven",
    desc: "Built for social good — empowering everyday heroes to make change.",
    icon: "🤝",
  },
];



const WhyBeingSmile = () => {
  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Why Choose <span className="text-blue-600 dark:text-blue-400">Us</span>
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          Empowering campaigns with trusted features and modern tools.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBeingSmile;
