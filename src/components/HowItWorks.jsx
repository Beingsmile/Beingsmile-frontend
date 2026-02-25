import { useState } from "react";
import how1 from "../assets/how1.jpg";
import how2 from "../assets/how2.jpg";
import how3 from "../assets/how3.jpg";
import { FiUserPlus, FiSearch, FiShield, FiArrowRight } from "react-icons/fi";

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
    <section className="py-24 px-4 bg-neutral overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight font-sans">
            How It <span className="text-primary text-outline">Works</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Starting a fundraiser or making a donation is a simple, 3-step process designed for impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Stepper Content */}
          <div className="space-y-4 order-2 lg:order-1">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className={`p-8 rounded-[2rem] cursor-pointer transition-all duration-500 border-2 ${activeStep === index
                    ? "bg-white border-primary shadow-2xl shadow-primary/10 -translate-y-1"
                    : "bg-transparent border-transparent grayscale opacity-50 hover:opacity-80"
                  }`}
              >
                <div className="flex gap-6 items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all ${activeStep === index ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-xl font-black uppercase tracking-tight ${activeStep === index ? "text-gray-900" : "text-gray-500"
                      }`}>
                      {step.title}
                    </h3>
                    {activeStep === index && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-500 space-y-6">
                        <p className="text-gray-600 font-medium leading-relaxed">
                          {step.text}
                        </p>
                        <a
                          href={step.buttonLink}
                          className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] border-b-2 border-primary pb-1 group"
                        >
                          {step.buttonText}
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                className="w-full h-full object-cover transition-all duration-700 animate-in fade-in zoom-in"
                key={activeStep}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />

              {/* Step counter */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black text-primary shadow-xl">
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
