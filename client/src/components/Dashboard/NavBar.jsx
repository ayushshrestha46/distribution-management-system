import  { useState } from "react";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  Bell,
  Search,
  User,
  Menu,
  X,
  Home,
  Truck,
  BarChart3,
} from "lucide-react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-lg">
                RetailConnect
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-indigo-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation Links */}
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Home className="h-5 w-5 mr-1" />
             Inventory
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-1" />
            Cart
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ClipboardList className="h-5 w-5 mr-1" />
              Orders
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Truck className="h-5 w-5 mr-1" />
              Suppliers
            </a>


            {/* Notification Icon */}
            <button className="text-gray-200 hover:bg-indigo-600 hover:text-white p-2 rounded-full relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-indigo-700"></span>
            </button>

            {/* User Profile */}
            <div className="ml-3 relative">
              <div>
                <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out">
                  <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-indigo-600 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative mb-3 px-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-indigo-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              New Order
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Order History
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Truck className="h-5 w-5 mr-2" />
              Suppliers
            </a>
            <a
              href="#"
              className="text-gray-200 hover:bg-indigo-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Reports
            </a>
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <span className="ml-3 text-gray-200 font-medium">
                  My Account
                </span>
              </div>
              <Bell className="h-6 w-6 text-gray-200" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
