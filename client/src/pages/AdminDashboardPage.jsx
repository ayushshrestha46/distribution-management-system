import { Sidebar, AdminNav } from "../components";
import { Outlet } from "react-router-dom";
const AdminDashboardPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <AdminNav/>
      <div className=" w-full">
      <Outlet/>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
