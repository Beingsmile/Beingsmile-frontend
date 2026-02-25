import { FiDollarSign, FiCheckCircle, FiCreditCard, FiBarChart2, FiShare2, FiLock, FiShield, FiHeart } from "react-icons/fi";

const features = [
  {
    title: "Zero Platform Fees",
    desc: "100% of your donation is delivered exactly where it matters. We never take a cut.",
    icon: <FiDollarSign />,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Verified Missions",
    desc: "Every campaign is manually reviewed by our team to guarantee authentic impact.",
    icon: <FiCheckCircle />,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Secure Payments",
    desc: "Multiple trusted local and international methods for seamless, fast giving.",
    icon: <FiCreditCard />,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Transparency",
    desc: "Track every cent from donation to impact with our real-time tracking tools.",
    icon: <FiBarChart2 />,
    color: "bg-orange-50 text-orange-600"
  }
];

const WhyBeingSmile = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Header Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
              <FiShield />
              Built for Trust
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans leading-tight">
              A Platform Designed for <span className="text-primary">Impact</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              BeingSmile is more than a crowdfunding site. It's a sanctuary for the bright human mind to express empathy and create real change in Bangladesh and beyond.
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-4 p-6 bg-accent/5 rounded-3xl border border-accent/10">
                <div className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  <FiHeart />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 italic">"Giving is not just about making a donation, it's about making a difference."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-neutral rounded-[2rem] border border-gray-50 hover:bg-white hover:border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all group-hover:scale-110 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBeingSmile;
