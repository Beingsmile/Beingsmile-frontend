import heroImage from "../assets/hero.jpg"; // Adjust the path as necessary

const Hero = () => {
  return (
    <section className="relative ">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Happy beneficiary"
          className="w-full h-full object-cover opacity-100 dark:opacity-70"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center">
        {/* Background effect */}
        <div
          className="absolute inset-0 bg-[url('/your-bg-image.jpg')] bg-cover bg-center opacity-20 dark:opacity-25"
          aria-hidden="true"
        ></div>
        

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white dark:text-white leading-tight tracking-tight drop-shadow-lg">
            <span className="block">Empower Hope.</span>
            <span className="block text-blue-600 dark:text-blue-400">
              Fund Dreams.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-2xl text-white font-semibold max-w-3xl mx-auto drop-shadow-lg">
            Start or support life-changing campaigns around the world.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all"
            >
              🚀 Start a Campaign
            </a>
            <a
              href="#"
              className="px-8 py-4 text-lg font-semibold rounded-xl bg-white text-gray-900 shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-all"
            >
              🔍 Browse Campaigns
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
