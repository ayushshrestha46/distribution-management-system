import { Mail, MapPin, Phone, Truck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      <footer className="bg-gray-900 text-white pt-16 pb-8 md:px-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-6">
                <Truck className="w-8 h-8" />
                <span className="ml-2 text-xl font-bold">DISTRO</span>
              </div>
              <p className="text-gray-400">
                Leading provider of distribution management solutions and
                logistics optimization.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Link</h3>

              <div className=" flex flex-col  items-start space-y-2">
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-gray-400 hover:text-gray-100"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-400 hover:text-gray-100"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("solutions")}
                  className="text-gray-400 hover:text-gray-100"
                >
                  Solutions
                </button>

                <button
                  onClick={() => scrollToSection("resources")}
                  className="text-gray-400 hover:text-gray-100"
                >
                  Resources
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start space-y-2 min-w-[150px]">
              <h2 className="font-semibold mb-2">Resources</h2>
              <button
                onClick={() => scrollToSection("choose")}
                className="text-gray-400 hover:text-gray-100"
              >
                <span>Choose Us</span>
              </button>
              <Link to="/terms" className="text-gray-400 hover:text-gray-100">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-gray-100">
                Privacy Policy
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-gray-100">
                Support
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  123 Distribution Center, Ktm, Nepal
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +977 (555) 123-4567
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  info@distro.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DISTRO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
