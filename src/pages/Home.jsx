import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
