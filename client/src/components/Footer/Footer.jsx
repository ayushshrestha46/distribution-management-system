import { Mail, MapPin, Phone, Truck } from "lucide-react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white pt-16 pb-8">
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
              <h3 className="text-lg font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Warehouse Management
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Route Optimization
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Inventory Control
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  123 Distribution Center, New York, NY 10001
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  +1 (555) 123-4567
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
