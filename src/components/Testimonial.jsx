import { useEffect, useRef, useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight, FiMessageCircle } from "react-icons/fi";
import userImg from "../assets/testimonialUser.jpg";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Campaign Organizer",
    review:
      "BeingSmile helped me raise funds for my daughter's medical treatment when we had no hope left. The community is incredibly kind.",
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
    review:
      "Our community center renovation was fully funded through BeingSmile. The humanitarian spirit here is truly inspiring.",
    image: userImg,
    rating: 5,
  },
];

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dragStartX = useRef(null);
  const dragThreshold = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX || e.touches[0].clientX;
  };

  const handleDragEnd = (e) => {
    const endX = e.clientX || e.changedTouches[0].clientX;
    const diff = endX - dragStartX.current;
    if (diff > dragThreshold) prevSlide();
    if (diff < -dragThreshold) nextSlide();
  };

  return (
    <section className="bg-neutral py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight font-sans">
            Voices of <span className="text-primary">Gratitude</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Real impact, felt by real people. Discover the humanitarian spirit that drives Beingsmile.
          </p>
        </div>

        <div className="relative">
          {/* Main Slider */}
          <div
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4 md:px-8">
                  <div className="bg-white rounded-[3rem] border-8 border-white shadow-2xl shadow-gray-200/50 p-10 md:p-16 relative overflow-hidden group">
                    {/* Background Decoration */}
                    <div className="absolute -top-10 -right-10 text-[15rem] text-primary/5 -rotate-12 select-none group-hover:rotate-0 transition-transform duration-1000">
                      <FiMessageCircle />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="w-24 h-24 mb-8 relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-[2rem] rotate-6 animate-pulse"></div>
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full rounded-[2rem] object-cover relative z-10 border-4 border-white shadow-xl"
                        />
                      </div>

                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`text-xl ${i < testimonial.rating ? "text-accent fill-accent" : "text-gray-200"}`}
                          />
                        ))}
                      </div>

                      <blockquote className="text-xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight max-w-3xl mb-10 font-sans">
                        "{testimonial.review}"
                      </blockquote>

                      <div>
                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-widest leading-none mb-2">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:scale-110 transition-all cursor-pointer"
            >
              <FiChevronLeft className="text-2xl" />
            </button>

            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${currentSlide === index ? "w-10 bg-primary shadow-lg shadow-primary/20" : "w-2 bg-gray-200"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-gray-200 flex items-center justify-center text-gray-400 hover:text-primary hover:scale-110 transition-all cursor-pointer"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
