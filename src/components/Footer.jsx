import { Link } from "react-router";
import { FiHeart, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiArrowRight } from "react-icons/fi";

const CTABanner = () => (
  <section className="py-16 px-4 bg-[#1B4332]">
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <p className="text-[#52B788] text-xs font-bold uppercase tracking-widest">আজই যোগ দিন</p>
      <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug">
        আজই আপনার ভোটের প্রকৃত প্রকাশ করুন!
      </h2>
      <p className="text-sm text-white/60 leading-relaxed max-w-xl mx-auto">
        Start your mission today, or donate to a cause you believe in. Together, we build a bridge of hope and transparency for Bangladesh.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/campaigns/create"
          className="btn-primary text-sm w-full sm:w-auto justify-center"
          style={{ background: "#2D6A4F" }}
        >
          <FiHeart size={14} />
          শুরু করুন
        </Link>
        <Link
          to="/campaigns/browse"
          className="btn-outline-white text-sm w-full sm:w-auto text-center"
        >
          ক্যাম্পেইন দেখুন
          <FiArrowRight size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  </section>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Browse Campaigns", to: "/campaigns/browse" },
      { label: "Start Fundraising", to: "/campaigns/create" },
      { label: "How It Works", to: "/" },
      { label: "Success Stories", to: "/" },
    ],
    support: [
      { label: "Help Center", to: "/contact-us" },
      { label: "Contact Us", to: "/contact-us" },
      { label: "FAQ", to: "/contact-us" },
      { label: "Payment Safety", to: "/contact-us" },
    ],
    legal: [
      { label: "Privacy Policy", to: "/contact-us" },
      { label: "Terms of Service", to: "/contact-us" },
      { label: "Cookie Policy", to: "/contact-us" },
    ]
  };

  return (
    <>
      <CTABanner />
      <footer className="bg-[#0D2B1E] text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-4 space-y-5">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2D6A4F] rounded-lg flex items-center justify-center">
                  <FiHeart className="text-white" size={14} />
                </div>
                <span className="text-xl font-black tracking-tight text-white">
                  Being<span className="text-[#52B788]">Smile</span>
                </span>
              </Link>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                A humanitarian crowdfunding sanctuary dedicated to the brightness of the human mind. We connect hearts to create lasting smiles across Bangladesh.
              </p>
              <div className="flex gap-3">
                {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-[#2D6A4F] hover:text-white transition-all"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Platform</h4>
                <ul className="space-y-3">
                  {footerLinks.platform.map((link, idx) => (
                    <li key={idx}>
                      <Link to={link.to} className="text-sm text-white/60 hover:text-[#52B788] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, idx) => (
                    <li key={idx}>
                      <Link to={link.to} className="text-sm text-white/60 hover:text-[#52B788] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Legal</h4>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, idx) => (
                    <li key={idx}>
                      <Link to={link.to} className="text-sm text-white/60 hover:text-[#52B788] transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30">
              © {currentYear} BeingSmile Platform. All Rights Reserved.
            </p>
            <p className="text-xs text-white/30 flex items-center gap-1">
              Developed with <FiHeart className="text-[#52B788]" size={11} /> by{" "}
              <a href="https://neexzen.com/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#52B788] ml-1 transition-colors">
                Neexzen
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;