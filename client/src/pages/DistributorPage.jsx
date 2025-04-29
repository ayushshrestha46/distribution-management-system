import { DisNavbar, DistributorSidebar } from "../components";
import { Outlet } from "react-router-dom";
const DistributorPage = () => {
  return (
    <div className="flex">
      {/* <AdminNav /> */}
      <DistributorSidebar />
      <div className=" w-full">
        <DisNavbar />
          <Outlet />
      </div>
    </div>
  );
};

export default DistributorPage;
