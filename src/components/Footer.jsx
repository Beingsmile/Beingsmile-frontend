import { Link } from "react-router";
import { FiHeart, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

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
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <FiHeart className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900 uppercase font-sans">
                Being<span className="text-primary">Smile</span>
              </span>
            </Link>
            <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-md">
              A humanitarian crowdfunding sanctuary dedicated to the brightness of the human mind. We connect hearts to create lasting smiles across Bangladesh.
            </p>
            <div className="flex gap-4">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 font-sans">Platform</h4>
              <ul className="space-y-4">
                {footerLinks.platform.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 font-sans">Support</h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 font-sans">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            © {currentYear} BeingSmile Platform. All Rights Reserved.
          </p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Developed with <FiHeart className="inline text-accent animate-pulse mx-1" /> by
            <a href="https://neexzen.com/" target="_blank" rel="noopener noreferrer" className="text-gray-900 ml-1 hover:text-primary transition-colors">
              Neexzen
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;