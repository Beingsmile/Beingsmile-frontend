import heroImage from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center md:justify-start justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Volunteers helping"
          className="w-full h-full object-cover"
        />
        {/* subtle gradient to left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content Positioned Bottom Left */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex items-end h-full w-full ">
        <div className="text-left text-white max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
            Empower Hope. <br />
            <span className="text-blue-700">Fund Dreams.</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-medium text-gray-200 drop-shadow">
            Start or support life-changing campaigns around the world.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="px-6 py-3 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition focus:ring-4 focus:ring-blue-400"
            >
              🚀 Start a Campaign
            </a>
            <a
              href="#"
              className="px-6 py-3 text-base font-semibold rounded-lg bg-white text-gray-800 hover:bg-gray-100 transition focus:ring-4 focus:ring-gray-300"
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
