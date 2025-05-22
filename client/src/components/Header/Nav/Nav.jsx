import {
  LogIn,
  Menu,
  Search,
  Truck,
  UserCircle,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutButton } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfileQuery } from "@/app/slices/userApiSlice";

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  const { data } = useGetUserProfileQuery();
  const profile = data?.user?.avatar?.url;
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 md:px-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-900" />
            <Link to={"/"} className="ml-2 text-2xl font-bold text-blue-900">
              DISTRO
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-blue-900"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 hover:text-blue-900"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("solutions")}
              className="text-gray-700 hover:text-blue-900"
            >
              Solutions
            </button>

            <button
              onClick={() => scrollToSection("choose")}
              className="text-gray-700 hover:text-blue-900"
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToSection("resources")}
              className="text-gray-700 hover:text-blue-900"
            >
              Resources
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="hidden md:flex md:items-center md:space-x-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                      <Avatar className="ring-2">
                        <AvatarImage src={profile} className="object-cover" />
                        <AvatarFallback className="uppercase font-semibold">
                          {user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="ml-2 text-md shadow-sm">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link to="/profile">
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 p-3">
                          <UserCircle className="mr-2 ml-3" />
                          <span className="font-medium text-md">Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <LogoutButton className="bg-no w-full ml-2.5 justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {user?.role === "shop" ? (
                    <Link to="/dashboard">
                      <Button className="bg-indigo-600 text-white hover:bg-indigo-700 ml-2">
                        Dashboard
                      </Button>
                    </Link>
                  ) : user?.role === "distributor" ? (
                    <Link to="/distributor">
                      <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
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
                  <Link
                    to="/settings"
                    className="text-gray-200 hover:bg-[#1E3A8A]/90 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  >
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </Link>
                  <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
