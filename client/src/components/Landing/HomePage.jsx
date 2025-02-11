import Nav from "../Header/Nav";
import { Interactive } from "./Interactive";
import { StatsSection } from "./Stats";
import { ServicesSection } from "./Services";
import { BenefitCards } from "./BenefitCards";
import { Work } from "./Work";
import { Seamless } from "./Seamless";
import { Testimonial } from "./Testimonial";
import Footer from "../Footer/Footer";
import Hero from "./Hero";
import Top from "./Top";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Top />
      <Nav />
      <Hero />
      <Interactive />
      <StatsSection />
      <ServicesSection />
      <Work />
      <BenefitCards />
      <Seamless />
      <Testimonial />
      <Footer />
    </div>
  );
}

export default Home;
