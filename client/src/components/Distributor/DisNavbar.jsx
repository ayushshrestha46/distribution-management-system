import { LogIn, Settings, UserCircle, UserPlus } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfileQuery } from "@/app/slices/userApiSlice";

const DisNavbar = () => {
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetUserProfileQuery();
  const profile = data?.user?.avatar?.url;
  return (
    <>
      <div className=" ">
        <div className="hidden md:flex md:items-center md:space-x-4 h-16  px-8  justify-end bg-white border-b border-gray-200 ">
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
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DisNavbar;
