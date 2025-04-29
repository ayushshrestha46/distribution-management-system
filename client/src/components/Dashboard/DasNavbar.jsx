import { useState } from "react";
import {
  ShoppingCart,
  Package,
  ClipboardList,
  Search,
  User,
  Menu,
  X,
  Home,
  Truck,
  BarChart3,
  LogIn,
  UserPlus,
  UserCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LogoutButton } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DasNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const user = useSelector((state) => state.auth.user);

  return (
    <nav className="bg-[#1E3A8A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Package className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-lg">DISTRO</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
      

            {/* Navigation Links */}
            <Link
              to="/dashboard"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Home className="h-5 w-5 mr-1" />
              Inventory
            </Link>
            <Link
              to="cart"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-1" />
              Cart
              {itemCount > 0 && (
                <span className="ml-1 bg-white text-[#1E3A8A]/90 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard/orders"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ClipboardList className="h-5 w-5 mr-1" />
              Orders
            </Link>
            <Link
              to="/dashboard/supplier"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Truck className="h-5 w-5 mr-1" />
              Suppliers
            </Link>

            {/* User Profile/Auth for Desktop */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  Register
                </Link>
              </>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="flex items-center space-x-1 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-indigo-800 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-gray-200 text-sm">{user.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel className="ml-2 text-sm shadow-sm">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-2">
                      <UserCircle className="mr-2 ml-2 w-4 h-4" />
                      <span className="font-medium text-sm">Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />

                  <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-[#1E3A8A]/90 focus:outline-none"
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
        <div className="md:hidden bg-[#1E3A8A] border-t border-[#2B4A9D]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Search */}
            <div className="relative mb-3 px-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-[#1E3A8A]/90 text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/dashboard"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Home className="h-5 w-5 mr-2" />
              Inventory
            </Link>
            <Link
              to="/cart"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {itemCount > 0 && (
                <span className="ml-2 bg-white text-[#1E3A8A]/90 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              to="/orders"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              Orders
            </Link>
            <Link
              to="/dashboard/supplier"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <Truck className="h-5 w-5 mr-2" />
              Suppliers
            </Link>
            <Link
              to="/reports"
              className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Reports
            </Link>

            {/* Mobile Auth Section */}
            {!user ? (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center px-3 py-2 text-gray-200">
                  <UserCircle className="h-6 w-6 mr-2" />
                  <span>{user.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <UserCircle className="h-5 w-5 mr-2" />
                  Profile
                </Link>

                <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default DasNavbar;
