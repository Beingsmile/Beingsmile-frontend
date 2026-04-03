import { useEffect } from "react";
import { FiSend, FiMail, FiPhone, FiMapPin, FiMessageSquare, FiArrowRight } from "react-icons/fi";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const contactItems = [
    { icon: <FiMail size={18} />, title: "Email Inquiry", detail: "hello@beingsmile.org" },
    { icon: <FiPhone size={18} />, title: "Phone Support", detail: "+880 1234 567890" },
    { icon: <FiMapPin size={18} />, title: "Our Base", detail: "Dhaka, Bangladesh" },
    { icon: <FiMessageSquare size={18} />, title: "Social", detail: "@beingsmile_impact" },
  ];

  return (
    <div className="bg-white min-h-screen pt-8 pb-20">
      {/* Page Header Banner */}
      <div className="bg-[#F0FBF4] border-b border-[#D1EAD9] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest mb-2">Contact</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Let's Start a <em className="not-italic text-[#2D6A4F]">Movement</em>
          </h1>
          <p className="text-sm text-gray-500 mt-3 max-w-lg leading-relaxed">
            Your voice is the heartbeat of our missions. Whether you have a question about a campaign or want to partner with us, we're here to listen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left: Contact Info */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-[#E5F0EA] hover:border-[#2D6A4F] hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-lg bg-[#F0FBF4] flex items-center justify-center text-[#2D6A4F] flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{item.title}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA mini-card */}
            <div className="p-6 bg-[#1B4332] rounded-xl text-white">
              <h3 className="text-base font-bold mb-2">Want to Start a Mission?</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Join thousands of fundraisers who are making a real difference in Bangladesh and beyond.
              </p>
              <a href="/campaigns/create" className="btn-primary text-sm">
                Start a Mission <FiArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-xl border border-[#E5F0EA] shadow-sm p-7 md:p-10">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white rounded-lg outline-none text-sm text-gray-800 font-medium transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white rounded-lg outline-none text-sm text-gray-800 font-medium transition-all"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white rounded-lg outline-none text-sm text-gray-800 font-medium transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 bg-[#F8FDFB] border border-[#E5F0EA] focus:border-[#2D6A4F] focus:bg-white rounded-lg outline-none text-sm text-gray-800 font-medium transition-all resize-none"
                  placeholder="Share your story or question..."
                />
              </div>

              <button className="w-full btn-primary justify-center text-sm">
                Send Message
                <FiArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
