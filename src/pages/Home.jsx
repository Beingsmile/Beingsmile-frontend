import FAQ from "../components/FAQ";
import FeaturedCampaigns from "../components/FeaturedCampaigns";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Payment from "../components/Payment";
import Testimonial from "../components/Testimonial";
import WhyBeingSmile from "../components/WhyBeingSmile";
import { useEffect } from 'react';

const Home = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [])

  return (
    <div>
      <main className="min-h-screen ">
        <Hero />
        {/* <FeaturedCampaigns /> */}
        <HowItWorks />
        <WhyBeingSmile />
        <Testimonial />
        <FAQ />
      </main>
      
    </div>
  );
};

export default Home;
