import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Layers, Info, LogIn, UserPlus, FileCog } from "lucide-react";
import Menu from "../Menu";

import { Button } from "../ui/button";
import { LogoutButton } from "..";

const Nav = () => {
  const userdata = useSelector((state) => state.auth.user);

  return (
    <nav className="fixed w-full top-0 z-50 ">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-full flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center space-x-2 text-[#586BAF] hover:text-indigo-500 transition-colors"
              >
                <Layers className="h-8 w-8" />
                <span className="font-bold text-xl hidden sm:block">
                  EXPENSE TRACKER
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Menu />
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <Info className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <FileCog className="h-4 w-4" />
                <span>Services</span>
              </Link>
            </div>

            {/* Auth buttons */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {!userdata ? (
                <>
                  <Link
                    to="/dms/login"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/dms/register"
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {userdata.name || "User"}
                  </span>
                  <LogoutButton />
                  <div>
                    <Link to={"/dashboard"}>
                      <Button className="bg-zinc-500 text-white">
                        Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
