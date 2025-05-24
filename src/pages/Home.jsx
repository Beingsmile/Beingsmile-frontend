import FAQ from "../components/FAQ";
import FeaturedCampaigns from "../components/FeaturedCampaigns";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import { NavComponent } from "../components/Navbar";
import Testimonial from "../components/Testimonial";
import WhyBeingSmile from "../components/WhyBeingSmile";

const Home = () => {
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <NavComponent />
      </nav>
      <main className="min-h-screen mt-14">
        <Hero />
        <FeaturedCampaigns />
        <HowItWorks />
        <WhyBeingSmile />
        <Testimonial />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
