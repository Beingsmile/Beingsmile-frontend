import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Testimonial />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
