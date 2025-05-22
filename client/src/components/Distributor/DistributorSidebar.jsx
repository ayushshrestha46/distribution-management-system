import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  ChevronRight,
  WarehouseIcon,
  BarChart3,
  TruckIcon,
  Package,
  CreditCard,
} from "lucide-react";
import { LogoutButton } from "..";

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart3, text: "Dashboard", count: null, path: "/distributor" },
    {
      icon: WarehouseIcon,
      text: "Inventories",
      path: "/distributor/inventory",
    },

    { icon: TruckIcon, text: "Shipments", path: "/distributor/shipment" },
    { icon: Users, text: "Customers", path: "/distributor/customers"},
    { icon: CreditCard, text: "Payments", path: "/distributor/payments"},
  ];

  return (
    <div className="w-72 h-screen border-r border-gray-200 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 p-6 border-b border-gray-100">
          <Link to="/distributor" className="flex-shrink-0 flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              DISTRO
            </h1>
          </Link>
        </div>

        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center justify-self-between gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium mr-2">{item.text} </span>
                  <span className="font-medium">{item?.count}</span>
                </div>
                {location.pathname === item.path && (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <LogoutButton
          className="bg-no w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50"
          // isSidebarCollapsed={isSidebarCollapsed} // Pass this prop
        />
      </div>
    </div>
  );
};

export default DashboardSidebar;
