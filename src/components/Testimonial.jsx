import { useEffect, useRef, useState } from "react";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const dragStartX = useRef(null);
  const dragThreshold = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToSlide = (index) => setCurrentSlide(index);

  const handleDragStart = (e) => {
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX;
  };

  const handleDragEnd = (e) => {
    if (dragStartX.current == null) return;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const diff = endX - dragStartX.current;
    if (diff > dragThreshold) prevSlide();
    if (diff < -dragThreshold) nextSlide();
    dragStartX.current = null;
  };

  return (
    <section className="bg-neutral py-20 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight font-sans">
            Voices of <span className="text-primary">Gratitude</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Real impact, felt by real people. Discover the humanitarian spirit that drives Beingsmile.
          </p>
        </div>

        <div className="relative overflow-hidden">
          {/* Slider track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="w-full shrink-0 px-1"
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 text-center select-none cursor-grab active:cursor-grabbing">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex justify-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-lg ${i < testimonial.rating ? "text-accent fill-accent" : "text-gray-200"}`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-snug max-w-2xl mx-auto mb-8 font-sans">
                    "{testimonial.review}"
                  </blockquote>

                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
            >
              <FiChevronLeft className="text-xl" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-400 ${currentSlide === index ? "w-8 bg-primary" : "w-2 bg-gray-200"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
