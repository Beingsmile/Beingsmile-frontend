import { Link, useOutletContext } from "react-router";
import heroImage from "../assets/hero.jpg";
import { AuthContext } from "../contexts/AuthProvider";
import { useContext } from "react";
import { FiArrowRight, FiCheckCircle, FiHeart } from "react-icons/fi";

const Hero = () => {
  const { user } = useContext(AuthContext);
  const { setAuth } = useOutletContext();

  return (
    <section className="relative bg-neutral overflow-hidden pt-16 pb-12 md:pt-20 md:pb-20">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-[10px] font-black tracking-widest uppercase border border-primary/10">
              <FiCheckCircle size={12} />
              Trusted by 5,000+ Heroes
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight font-sans uppercase">
              Transforming <span className="text-primary">Humanity</span> <br />Through One <span className="relative inline-block mt-2 font-black italic">
                Smile
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-accent/20 rounded-full" />
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium italic">
              "We connect compassionate hearts with missions making a difference. Join a global community driven by the brightness of human kindness."
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              {user ? (
                <Link
                  to="/campaigns/create"
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                >
                  Launch Mission
                  <FiArrowRight size={16} />
                </Link>
              ) : (
                <button
                  onClick={() => setAuth("login")}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Launch Mission
                  <FiArrowRight size={16} />
                </button>
              )}

              <Link
                to="/campaigns/browse"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-100 font-black text-xs uppercase tracking-widest rounded-xl hover:border-primary/50 transition-all flex items-center justify-center gap-2"
              >
                Explore Causes
              </Link>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative animate-in zoom-in duration-1000">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border-8 border-white shadow-xl shadow-gray-200/50 group">
              <img
                src={heroImage}
                alt="Humanitarian Impact"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Floating Impact Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-50 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FiHeart className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Impact</p>
                  <p className="text-sm font-black text-gray-900">৳14,500 for Sylhet</p>
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
