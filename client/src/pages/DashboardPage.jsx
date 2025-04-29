import { DasNavbar } from "../components";
import { Outlet } from "react-router-dom";
const DashboardPage = () => {
  return (
    <div className="">
      <DasNavbar/>
      <div className=" w-full">
        <Outlet />
      </div>
    </div>
  );
}; 

export default DashboardPage;
