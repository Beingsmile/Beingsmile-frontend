import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
