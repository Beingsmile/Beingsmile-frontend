import { useState } from "react";
import how1 from "../assets/how1.jpg";
import how2 from "../assets/how2.jpg";
import how3 from "../assets/how3.jpg";
import { FiUserPlus, FiSearch, FiShield, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

const steps = [
  {
    title: "Join the Community",
    text: "Create an account in seconds to start your journey as a donor or a fundraiser. We're a family built on trust.",
    image: how1,
    icon: <FiUserPlus />,
    buttonText: "Join Now",
    buttonLink: "/signup",
  },
  {
    title: "Discover Stories",
    text: "Browse through verified campaigns that resonate with your heart. Transparency is our core promise.",
    image: how2,
    icon: <FiSearch />,
    buttonText: "Explore Causes",
    buttonLink: "/campaigns/browse",
  },
  {
    title: "Change a Life",
    text: "Donate securely via trusted platforms. 100% of your gift reaches the mission directly.",
    image: how3,
    icon: <FiShield />,
    buttonText: "Our Payments",
    buttonLink: "/contact-us",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-20 px-4 bg-neutral overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            Starting a fundraiser or making a donation is a simple, 3-step process designed for impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Stepper Content */}
          <div className="space-y-3 order-2 lg:order-1">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-400 border-2 ${activeStep === index
                    ? "bg-white border-primary shadow-lg shadow-primary/10 -translate-y-0.5"
                    : "bg-transparent border-transparent opacity-50 hover:opacity-75"
                  }`}
              >
                <div className="flex gap-5 items-start">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all ${activeStep === index ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {step.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className={`text-lg font-black uppercase tracking-tight ${activeStep === index ? "text-gray-900" : "text-gray-500"}`}>
                      {step.title}
                    </h3>
                    {activeStep === index && (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">
                          {step.text}
                        </p>
                        <Link
                          to={step.buttonLink}
                          className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] border-b-2 border-primary pb-1 group"
                        >
                          {step.buttonText}
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Side — smaller aspect ratio */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-full object-cover transition-all duration-700"
                key={activeStep}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
              {/* Step counter */}
              <div className="absolute top-5 right-5 w-12 h-12 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-lg font-black text-primary shadow-md">
                0{activeStep + 1}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
