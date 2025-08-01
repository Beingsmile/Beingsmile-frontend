import FAQ from "../components/FAQ";
import FeaturedCampaigns from "../components/FeaturedCampaigns";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Payment from "../components/Payment";
import Testimonial from "../components/Testimonial";
import WhyBeingSmile from "../components/WhyBeingSmile";

const Home = () => {

  return (
    <div>
      <main className="min-h-screen -mt-4">
        <Hero />
        {/* <FeaturedCampaigns /> */}
        {/* <Payment /> */}
        <HowItWorks />
        <WhyBeingSmile />
        <Testimonial />
        <FAQ />
      </main>
      
    </div>
  );
};

export default Home;
