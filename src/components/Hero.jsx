import { Link, useOutletContext } from "react-router";
import heroImage from "../assets/hero.jpg";
import { AuthContext } from "../contexts/AuthProvider";
import { useContext } from "react";
import { FiArrowRight, FiCheckCircle, FiHeart } from "react-icons/fi";

const Hero = () => {
  const { user } = useContext(AuthContext);
  const { setAuth } = useOutletContext();

  return (
    <section className="relative bg-neutral overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase">
              <FiCheckCircle className="text-primary" />
              Trusted by 5,000+ Donors
            </div>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight font-sans">
              Transforming <span className="text-primary">Humanity</span> Through One <span className="relative inline-block mt-2">
                Smile
                <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-accent/30 rounded-full" />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              We connect compassionate hearts with creators making a difference. Join a global community driven by the brightness of the human mind.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
              {user ? (
                <Link
                  to="/campaigns/create"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Start Your Mission
                  <FiArrowRight size={20} />
                </Link>
              ) : (
                <button
                  onClick={() => setAuth("login")}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Start Your Mission
                  <FiArrowRight size={20} />
                </button>
              )}

              <Link
                to="/campaigns/browse"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 font-black rounded-2xl hover:border-primary transition-all flex items-center justify-center gap-2"
              >
                Explore Causes
              </Link>
            </div>

            <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-gray-900">$2.4M+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Raised</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-gray-900">450+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Campaigns</p>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative animate-in zoom-in duration-1000">
            <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
              <img
                src={heroImage}
                alt="Humanitarian Impact"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Impact Card */}
            <div className="absolute -bottom-8 -left-8 md:-left-12 bg-white p-6 rounded-3xl shadow-2xl animate-[float_4s_ease-in-out_infinite] hidden sm:block border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <FiHeart className="text-accent text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Donation</p>
                  <p className="text-lg font-black text-gray-900">$500 for Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
