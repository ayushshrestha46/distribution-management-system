import { useState } from "react";
import { CheckCircle, XCircle, Clock, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import { ScrollArea } from "../ui/scroll-area";
import {
  useGetAllocationRequestQuery,
  useAllocateDistrubitorMutation,
} from "@/app/slices/adminApiSlice";
import { useGetAllSupplierQuery } from "@/app/slices/supplierApiSlice";

function Request() {
  // const [requests, setRequests] = useState(initialRequests);
  const [selectedSupplier, setSelectedSupplier] = useState(" ");

  const { data: suppliersData, isLoading: supplierLoading } =
    useGetAllSupplierQuery();
  const suppliers = Array.isArray(suppliersData?.distributors)
    ? suppliersData.distributors
    : [];
  console.log(suppliers);
  //   const products = Array.isArray(data) ? data : [];
  // console.log(products);
  const {
    data: requestData,
    isLoading,
    refetch,
  } = useGetAllocationRequestQuery();
  let requests = Array.isArray(requestData?.users) ? requestData.users : [];
  requests = [...requests].reverse();

  const [allocateDistributor] = useAllocateDistrubitorMutation();

  const handleApprove = async (userId) => {
    console.log(selectedSupplier, userId);
    try {
      const res = await allocateDistributor({
        selectedSupplier,
        userId,
      }).unwrap();
      if (res.success) {
        toast.success(res.message);
        refetch();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDropdownChange = (value) => {
    setSelectedSupplier(value);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="pt-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-6">
        <div className="flex items-center justify-center mb-8 pt-4">
          <Building2 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Supplier Request</h1>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)]">
          {requests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                No supplier requests pending.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {requests.map((request) => (
                <div
                  key={request.requestId}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          {getStatusIcon(request.status)}
                          <span
                            className={`ml-2 text-sm font-medium px-3 py-1 rounded-full bg-opacity-10 capitalize
                            ${
                              request.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                          Request By : {request.name}
                        </h3>
                        <p className="text-gray-600">Shop ID : {request._id}</p>
                        <p>Address : {request.address}</p>
                        <p>Email : {request.email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(request.timestamp).toLocaleString()}
                        </p>
                      </div>

                      {request.requestDistributor === "process" && (
                        <div className="mt-4 md:mt-0 flex space-x-3">
                          <button
                            onClick={() => handleReject(request.requestId)}
                            className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors duration-200 flex items-center"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(request._id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                        </div>
                      )}
                    </div>

                    {request.requestDistributor === "process" && (
                      <div className="mt-6 space-y-4">
                        <select
                          value={selectedSupplier || ""}
                          onChange={(e) => handleDropdownChange(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">Select a supplier</option>
                          {suppliers?.map((option) => (
                            <option key={option._id} value={option?._id}>
                              {option?.user.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}

export default Request;
