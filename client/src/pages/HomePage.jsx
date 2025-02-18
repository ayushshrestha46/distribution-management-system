import {
  Interactive,
  Hero,
  StatsSection,
  ServicesSection,
  Work,
  BenefitCards,
  Seamless,
  Testimonial,
} from "../components/Landing";
import { Nav, Footer } from "../components/index";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
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
};

export default HomePage;
