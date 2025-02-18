import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Building2,
  Wallet,
  FileText,
  Package,
  User as UserIcon,
  Plus,
} from "lucide-react";
import { Button } from "../ui/button";
import { useGetAllSuppliersQuery } from "@/app/slices/supplierApiSlice";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";

// Simulated API call - replace with your actual API call
// const fetchDistributors = async () => {
//   // Replace with your API endpoint
//   const response = await fetch('/api/distributors');
//   const data = await response.json();
//   return data.distributors;
// };

function SupplierList() {
  // const [distributors, setDistributors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const { data, isLoading, isError } = useGetAllSuppliersQuery();
  console.log(data);
  const distributors = data?.distributors ?? [];

  // const allAreas = Array.from(
  //   new Set(distributors.flatMap(d => d.areaCovered))
  // ).sort();

  const filteredDistributors = distributors?.filter((distributor) => {
    const matchesSearch =
      distributor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      distributor.warehouseDetails.address
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesArea =
      selectedArea === "" || distributor.areaCovered.includes(selectedArea);

    return matchesSearch && matchesArea;
  });

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)] ">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">
                Manage your suppliers
              </h1>
              <Link to="/admin/add-supplier">
                <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Supplier
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search suppliers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <Button className="w-32 bg-blue-500 p-4">
            Add new Supplier
          </Button> */}
            {/* <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">All Areas</option>
            {allAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select> */}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Suppliers
              </h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {distributors?.length}
              </p>
            </div>
            {/* <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* <h3 className="text-sm font-medium text-gray-500">Active Areas</h3> */}
            {/* <p className="mt-1 text-2xl font-semibold text-gray-900">{allAreas.length}</p> */}
            {/* </div> */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">
                Total Balance
              </h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                $
                {distributors
                  ?.reduce((sum, d) => sum + d.availableBalance, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Average VAT</h3>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {(
                  distributors?.reduce((sum, d) => sum + d.vat, 0) /
                  (distributors.length || 1)
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>

          {/* Suppliers Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDistributors.map((distributor) => (
                <div
                  key={distributor._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        {distributor.user.avatar ? (
                          <img
                            src={distributor.user.avatar.url}
                            alt={distributor.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-blue-500" />
                          </div>
                        )}
                        <div className="ml-3">
                          <h2 className="text-lg font-semibold text-gray-900">
                            {distributor.user.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {distributor.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Areas Covered
                          </p>
                          <p className="text-sm text-gray-500">
                            {distributor.areaCovered.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Building2 className="w-5 h-5 text-gray-400 mt-1 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Warehouse
                          </p>
                          <p className="text-sm text-gray-500">
                            {distributor.warehouseDetails.address}
                          </p>
                          <p className="text-sm text-gray-500">
                            Contact Person:{" "}
                            {distributor.warehouseDetails.contactPerson}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">
                          {distributor.user.phone}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Wallet className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">
                          Balance: ${distributor.availableBalance.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <p className="text-sm text-gray-500">
                          VAT: {distributor.vat}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() =>
                          (window.location.href = `/supplier/${distributor._id}`)
                        }
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredDistributors?.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No suppliers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </ScrollArea>
  );
}

export default SupplierList;
