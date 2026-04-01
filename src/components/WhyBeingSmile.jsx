import { FiDollarSign, FiCheckCircle, FiShield, FiBarChart2 } from "react-icons/fi";

const stats = [
  { value: "৳৫২,৭৫২", label: "মোট সংগৃহীত", sub: "Total Raised" },
  { value: "১,৪৮,২৯", label: "উপকৃত পরিবার", sub: "Families Helped" },
  { value: "৬,৭৭৭", label: "সক্রিয় মিশন", sub: "Active Missions" },
  { value: "৬৬,০৫২", label: "মোট দাতা", sub: "Total Donors" },
];

const features = [
  {
    title: "100% Impact Delivery",
    desc: "Every taka you donate reaches the designated mission. Beingsmile takes zero platform commission.",
    icon: <FiDollarSign size={20} />,
  },
  {
    title: "Rigorous Review",
    desc: "Every mission is manually verified through our multi-step pipeline.",
    icon: <FiCheckCircle size={20} />,
  },
  {
    title: "Atomic Transactions",
    desc: "Our banking integrations ensure absolute idempotency on every payment.",
    icon: <FiShield size={20} />,
  },
  {
    title: "Government-Level Audit",
    desc: "Immutable audit trails for every transaction, accessible to administrators.",
    icon: <FiBarChart2 size={20} />,
  },
];

const WhyBeingSmile = () => {
  return (
    <>
      {/* Stats section — like reference "আমাদের অগ্রগতি" */}
      <section className="py-16 px-4 bg-[#F0FBF4] border-y border-[#D1EAD9]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-1">Our Progress</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">আমাদের অগ্রগতি</h2>
            <p className="text-xs text-gray-400 mt-2">জুলাই ২০২৩ থেকে এখন পর্যন্ত</p>
          </div>
          {/* 4-column stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-[#2D6A4F]">{stat.value}</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{stat.label}</p>
                <p className="text-[10px] text-gray-400 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Why Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              A Platform Designed for <em className="not-italic text-[#2D6A4F]">Impact</em>
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              BeingSmile is more than a crowdfunding site. It's a sanctuary for the bright human mind to express empathy and create real change.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-[#E5F0EA] bg-white hover:border-[#2D6A4F] hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#F0FBF4] flex items-center justify-center text-[#2D6A4F] mb-4 group-hover:bg-[#2D6A4F] group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyBeingSmile;
