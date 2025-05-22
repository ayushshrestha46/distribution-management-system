import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Package,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useGetSupplierRetailersQuery } from "@/app/slices/supplierApiSlice";
import { ScrollArea } from "../ui/scroll-area";

function DistributorCustomer() {
  // const [data, setData] = useState(null);
  const { data, isLoading } = useGetSupplierRetailersQuery();
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter retailers based on search term and filters
  const filteredRetailers = data?.users?.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      (user.address &&
        user.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesStatus;
  });

  // Check if any filters are active
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all";

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="relative mx-auto">
            <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-blue-500 animate-spin"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-800">
              Loading retailers...
            </p>
            <p className="text-sm text-gray-500">
              Gathering retailer information
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 px-4">
        <div className="w-full max-w-2xl border border-red-200 rounded-xl bg-white shadow-sm">
          <div className="bg-red-50 px-6 py-4 border-b">
            <h3 className="text-red-700 flex items-center gap-2 text-xl font-semibold">
              <XCircle className="h-5 w-5" />
              Error Loading Retailers
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-gray-600">
              There was a problem loading your retailers. This could be due to
              network issues or server problems.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-70px)]">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Retailers</h1>
            <p className="text-gray-600 mt-1">
              Manage and view all retailers assigned to your distribution area
            </p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            {/* Search and Filter Bar */}
            <div className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex-1 w-full sm:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search retailers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                </div>

                <div className="flex gap-2">
                  {["all", "verified", "unverified"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 text-sm font-medium rounded-md ${
                        statusFilter === status
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Retailers Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[240px]">
                      Retailer
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[220px]">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[220px]">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[120px]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[140px]">
                      Customer Since
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-[100px]">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRetailers?.map((retailer) => (
                    <tr key={retailer._id} className="group hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium border">
                            {getInitials(retailer.name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {retailer.name}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <ShoppingBag size={14} className="mr-1" />
                              {retailer.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin
                            size={16}
                            className="mr-2 text-gray-400 flex-shrink-0"
                          />
                          <span
                            className="truncate max-w-[160px]"
                            title={retailer.address}
                          >
                            {retailer.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail
                              size={16}
                              className="mr-2 text-gray-400 flex-shrink-0"
                            />
                            <span
                              className="truncate max-w-[160px]"
                              title={retailer.email}
                            >
                              {retailer.email}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone
                              size={16}
                              className="mr-2 text-gray-400 flex-shrink-0"
                            />
                            {retailer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            retailer.isVerified
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {retailer.isVerified ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {retailer.isVerified ? "Verified" : "Unverified"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar
                              size={14}
                              className="mr-1.5 text-gray-400"
                            />
                            <span>{formatDate(retailer.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center bg-gray-50 rounded-full py-1 px-3 text-gray-700 font-medium">
                          <Package size={14} className="mr-1.5 text-gray-400" />
                          <span className="text-sm">
                            {retailer.orderCount || 0}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!filteredRetailers || filteredRetailers.length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500 space-y-2">
                          <Users
                            size={48}
                            strokeWidth={1}
                            className="opacity-50"
                          />
                          <p className="text-lg font-medium">
                            No retailers found
                          </p>
                          {searchTerm ? (
                            <>
                              <p className="text-sm">
                                No results for "{searchTerm}"
                              </p>
                              <button
                                onClick={clearFilters}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                              >
                                Clear filters
                              </button>
                            </>
                          ) : (
                            <p className="text-sm">
                              No retailers match your current filters
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default DistributorCustomer;
