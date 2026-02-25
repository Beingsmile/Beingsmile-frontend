import { useEffect } from "react";
import { FiSend, FiMail, FiPhone, FiMapPin, FiMessageSquare, FiArrowRight } from "react-icons/fi";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-neutral min-h-screen pt-16 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Info Side */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
                <FiSend className="animate-pulse" />
                Connect With Us
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight font-sans leading-none uppercase">
                Let's Start a <br /><span className="text-primary italic">Movement</span>
              </h1>
              <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                Your voice is the heartbeat of our missions. Whether you have a question about a campaign or want to partner with us, we're here to listen.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                { icon: <FiMail />, title: "Inquiry", detail: "hello@beingsmile.org", bg: "bg-blue-50 text-blue-500" },
                { icon: <FiPhone />, title: "Support", detail: "+880 1234 567890", bg: "bg-green-50 text-green-500" },
                { icon: <FiMapPin />, title: "Base", detail: "Dhaka, Bangladesh", bg: "bg-primary/10 text-primary" },
                { icon: <FiMessageSquare />, title: "Social", detail: "@beingsmile_impact", bg: "bg-accent/10 text-accent" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform ${item.bg}`}>
                    {item.icon}
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.title}</h4>
                  <p className="text-sm font-bold text-gray-900">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-gray-200/50 border-4 border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <form className="space-y-6 relative z-10">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all"
                    placeholder="Hero Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Space</label>
                  <input
                    type="email"
                    className="w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Subject</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-bold transition-all"
                  placeholder="What's on your mind?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-6 py-4 bg-neutral border-2 border-transparent focus:border-primary/20 rounded-2xl outline-none text-gray-900 font-medium transition-all resize-none"
                  placeholder="Share your story or question..."
                />
              </div>

              <button className="w-full px-10 py-5 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                Send Mission Broadcast
                <FiArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
