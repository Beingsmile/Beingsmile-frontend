import { useEffect, useRef, useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight, FiMessageCircle } from "react-icons/fi";
import userImg from "../assets/testimonialUser.jpg";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Campaign Organizer",
    review: "BeingSmile helped me raise funds for my daughter's medical treatment when we had no hope left. The community is incredibly kind.",
    image: userImg,
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Donor",
    review: "I love that I can support causes directly. The transparency and real-time updates make it the most trustworthy platform.",
    image: userImg,
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Community Leader",
    review: "Our community center renovation was fully funded through BeingSmile. The humanitarian spirit here is truly inspiring.",
    image: userImg,
    rating: 5,
  },
];

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-bold text-[#2D6A4F] uppercase tracking-widest">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            ব্যবহারকারীদের মতামত
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Real impact, felt by real people. Discover the humanitarian spirit that drives Beingsmile.
          </p>
        </div>

        {/* 3-card testimonial grid — like the reference */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl border transition-all duration-300 ${
                index === currentSlide
                  ? "border-[#2D6A4F] shadow-md bg-[#F0FBF4]"
                  : "border-[#E5F0EA] bg-white hover:border-[#B7DFC9]"
              }`}
            >
              {/* Header row */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#D1EAD9] flex-shrink-0">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{testimonial.name}</h4>
                  <p className="text-xs text-[#2D6A4F] font-semibold">{testimonial.role}</p>
                </div>
                {/* Star */}
                <div className="flex gap-0.5 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={10} className={i < testimonial.rating ? "text-accent fill-accent" : "text-gray-200"} />
                  ))}
                </div>
              </div>

              {/* Review */}
              <div className="relative">
                <FiMessageCircle size={20} className="text-[#2D6A4F]/20 mb-2" />
                <p className="text-sm text-gray-600 leading-relaxed">"{testimonial.review}"</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <button onClick={prevSlide} className="w-8 h-8 rounded-full border border-[#D1EAD9] flex items-center justify-center text-gray-400 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors cursor-pointer">
            <FiChevronLeft size={14} />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === index ? "w-5 h-2 bg-[#2D6A4F]" : "w-2 h-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="w-8 h-8 rounded-full border border-[#D1EAD9] flex items-center justify-center text-gray-400 hover:border-[#2D6A4F] hover:text-[#2D6A4F] transition-colors cursor-pointer">
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
