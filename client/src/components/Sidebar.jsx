import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Building2,
  CircleDollarSign,
  ChevronRight,
  Package,
  ChevronDown,
  User2,
  Box,
} from "lucide-react";
import { LogoutButton } from ".";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin" },
    { icon: Box, text: "Inventories", path: "/admin/inventories" },
    { icon: Building2, text: "Suppliers", path: "/admin/suppliers" },
    { icon: Truck, text: "Shipments", path: "/admin/shipments" },
    {
      icon: Users,
      text: "Customers",
      children: [
        { icon: Users, text: "All Customers", path: "/admin/customers" },
        { icon: User2, text: "Supplier Request", path: "/admin/request" },
      ],
    },
    {
      icon: CircleDollarSign,
      text: "Payments",
      path: "/admin/all-payments",
    },
  ];

  return (
    <div className="w-80 h-screen border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 p-[15.5px] border-b">
          <Link to="/admin" className="flex-shrink-0 flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              DistriHub
            </h1>
          </Link>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                {/* Parent Menu Item */}
                <button
                  onClick={() =>
                    item.children
                      ? setOpenMenu(openMenu === item.text ? null : item.text)
                      : navigate(item.path)
                  }
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                  {item.children ? (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openMenu === item.text ? "rotate-180" : ""
                      }`}
                    />
                  ) : (
                    location.pathname === item.path && (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>

                {/* Submenu (Children) - Expands below */}
                {item.children && openMenu === item.text && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child, childIndex) => (
                      <button
                        key={childIndex}
                        onClick={() => navigate(child.path)}
                        className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
                          location.pathname === child.path
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm"
                            : "text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <child.icon className="h-5 w-5" />
                          <span className="font-medium">{child.text}</span>
                        </div>
                        {location.pathname === child.path && (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <LogoutButton className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50" />
      </div>
    </div>
  );
};

export default Sidebar;
