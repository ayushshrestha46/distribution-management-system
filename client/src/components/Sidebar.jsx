import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Warehouse,
  Building2,
  CircleDollarSign,
  LineChart,
  ChevronRight,
  PackagePlusIcon
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/admin" },
    { icon: Building2, text: "Suppliers", path: "/admin/suppliers" },
    { icon: PackagePlusIcon, text: "Products", path: "/admin/products" },

    // { icon: Package, text: "Inventory", path: "/inventory" },
    { icon: Truck, text: "Shipments", path: "/shipments" },
    { icon: Users, text: "Customers", path: "/customers" },
    { icon: Warehouse, text: "Warehouses", path: "/warehouses" },
    { icon: CircleDollarSign, text: "Finance", path: "/finance" },
    { icon: LineChart, text: "Analytics", path: "/analytics" },
  ];

  return (
    
    <div className="  w-72 h-full bg-white border-r border-gray-200">
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
          <Box className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
          DistriHub
        </h1>
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
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.text}</span>
              </div>
              {location.pathname === item.path && <ChevronRight className="h-4 w-4" />}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
