import { DashboardSidebar, AdminNav } from "../components";
import { Outlet } from "react-router-dom";
const DistributorPage = () => {
  return (
    <div className="flex">
      <DashboardSidebar />
      <AdminNav />
      <div className=" w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default DistributorPage;
