import { useEffect, useState } from "react";
import { TruckIcon, BoxIcon, ShoppingCart, Users } from "lucide-react";
import { useGetDistributorProfileQuery } from "@/app/slices/supplierApiSlice";

import { ChangePassword, DistributorOrders } from "../index";
import { ScrollArea } from "../ui/scroll-area";
import { useGetSupplierDashboardDataQuery } from "@/app/slices/supplierApiSlice";

function Dashboard() {
  const { data, isLoading } = useGetDistributorProfileQuery();
  const { data: dashboardData, isLoading: dataLoading } =
    useGetSupplierDashboardDataQuery();
  // console.log(dashboardData);
  const isFirst = data?.distributor.firstlogin;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isFirst === true) {
      setOpen(true);
    }
  }, [isFirst]);

  const dashboardCards = [
    {
      title: "Total Orders",
      value: dataLoading? 'loading..': dashboardData?.orderCount,
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Inventory Value",
      value: dataLoading? 'loading..':`Rs. ${dashboardData?.totalInventoryPrice.toLocaleString(
        "en-IN"
      )}`,
      change: "+8.2%",
      trend: "up",
      icon: BoxIcon,
    },
    {
      title: "Active Shipments",
      value: dataLoading? 'loading..':dashboardData?.orderInProcessCount,
      change: "-3.1%",
      trend: "down",
      icon: TruckIcon,
    },
    {
      title: "Customers",
      value: dataLoading? 'loading..':dashboardData?.customerCount,
      change: "+5.3%",
      trend: "up",
      icon: Users,
    },
  ];

  



  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      "in-transit": "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      "in-stock": "bg-green-100 text-green-800",
      "low-stock": "bg-yellow-100 text-yellow-800",
      "out-of-stock": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className=" bg-gray-50">
      <ChangePassword open={open} setOpen={setOpen} />
      <ScrollArea className="flex-1 h-[calc(100vh-65px)]  ">
        <div className=" p-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 my-1 mb-3">
              Welcome back! Here's what's happening with your distribution
              business today.
            </p>
          </div>
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
              {dashboardCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <card.icon className="w-8 h-8 text-blue-600" />

                  <h3 className="text-sm font-medium text-gray-500">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
            <DistributorOrders />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default Dashboard;
