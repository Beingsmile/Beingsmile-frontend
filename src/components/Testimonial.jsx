import { useEffect, useRef, useState } from "react";
import user from "../assets/testimonialUser.jpg";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Campaign Organizer",
    review:
      "BeingSmile helped me raise funds for my daughter's medical treatment...",
    image: user,
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Donor",
    review: "I love that I can support causes directly through BeingSmile...",
    image: user,
    rating: 4,
  },
  {
    name: "Emma Rodriguez",
    role: "Community Leader",
    review:
      "Our community center renovation was fully funded through BeingSmile...",
    image: user,
    rating: 5,
  },
];

const Testimonial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef();
  const dragStartX = useRef(null);
  const dragThreshold = 50;

  // Autoscroll
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // every 6 seconds
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

  // Drag handlers
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
    <section className="bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 md:mb-12">
          What People Say About <span className="text-blue-600 dark:text-blue-400">BeingSmile</span>
        </h2>

        <div className="relative overflow-hidden">
          {/* Testimonial Slider */}
          <div
            className="pt-12"
            ref={slideRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-1 md:px-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 text-center">
                    <div className="flex justify-center -mt-16 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                      />
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927a1 1 0 011.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 
  1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 
  3.292c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.8 
  2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
  1 0 00-.364-1.118L3.568 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
  1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm md:text-lg">
                      "{testimonial.review}"
                    </p>
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute md:block hidden top-1/2 left-6 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute md:block hidden top-1/2 right-6 transform -translate-y-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            aria-label="Next testimonial"
          >
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 md:mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index
                  ? "bg-blue-600 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
