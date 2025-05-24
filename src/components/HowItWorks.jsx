import { useState } from "react";
import how1 from "../assets/how1.jpg";
import how2 from "../assets/how2.jpg";
import how3 from "../assets/how3.jpg";

const steps = [
  {
    title: "Create an account & log in",
    text: "Sign up to join our community and start supporting or launching a campaign within seconds.",
    image: how1,
    buttonText: "Go to Sign Up",
    buttonLink: "/signup",
  },
  {
    title: "Browse inspiring campaigns",
    text: "Discover powerful, real stories that need your help. You can donate or share in one click.",
    image: how2,
    buttonText: "Browse Campaigns",
    buttonLink: "/campaigns",
  },
  {
    title: "Choose your payment method",
    text: "We support transparent payments via bKash, SSLCommerz, and Stripe — secure, fast, and trusted.",
    image: how3,
    buttonText: "Learn About Payments",
    buttonLink: "/payments",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white text-center">
        How It <span className="text-blue-600 dark:text-blue-400">Works</span>
      </h2>
      <p className="mt-2 mb-8 md:mb-12 text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        A simple 3-step process to start your fundraiser and make an impact.
      </p>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
          <img
            src={steps[activeStep].image}
            alt={`Step ${activeStep + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Dark mode overlay */}
          <div className="absolute inset-0 dark:bg-black/10" />
        </div>

        {/* Step Selector - Vertical on the left */}
        <div className="gap-6 md:gap-10 flex p-4 md:p-6 h-full">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex items-center gap-4 cursor-pointer transition ${
                  activeStep === index
                    ? "text-black dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition ${
                    activeStep === index
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "border-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          {/* Content - Step description */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {steps[activeStep].title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-md mb-6">
              {steps[activeStep].text}
            </p>
            <a
              href={steps[activeStep].buttonLink}
              className="inline-block px-6 py-3 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
            >
              {steps[activeStep].buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
