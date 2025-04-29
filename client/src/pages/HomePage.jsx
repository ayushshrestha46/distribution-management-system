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
import { Nav, Footer, ScrollToTop } from "../components/index";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white ">
      <Nav />
      <Hero />
      <Interactive />
      <StatsSection />
      <ServicesSection  />
      <Work />
      <BenefitCards />
      <Seamless />
      <Testimonial />
      <Footer />
      <ScrollToTop/>
    </div>
  );
};

export default HomePage;
