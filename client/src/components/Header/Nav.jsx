import { Menu, Search, Truck, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutButton } from "@/components";
const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-900" />
            <span className="ml-2 text-2xl font-bold text-blue-900">
              DISTRO
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900">
              Solutions
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900">
              Services
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900">
              Network
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900">
              Resources
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Track your shipment..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            {user ? (
              <>
                <p className="text-lg font-semibold text-gray-600">
                  Welcome, {user.name}
                </p>
                <LogoutButton />
              </>
            ) : (
              <Link
                to={"/register"}
                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-blue-900">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900">
                Solutions
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900">
                Services
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900">
                Network
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-900">
                Resources
              </a>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Track your shipment..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {user ? (
                <>
                  <p className="text-lg font-semibold text-gray-600">
                    Welcome, {user.name}
                  </p>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  to={"/register"}
                  className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors w-full"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
