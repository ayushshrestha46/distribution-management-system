import React from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Warehouse,
  Contact2,
  MapPinned,
  Unlink,
  FileText,
  Wallet,
} from "lucide-react";

import {
  useGetUserProfileQuery,
  useGetSuppliersQuery,
} from "@/app/slices/userApiSlice";
import { ScrollArea } from "../ui/scroll-area";

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
    <Icon className="w-5 h-5 text-blue-600 mt-1" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  </div>
);

const ViewSupplier = () => {
  const { data: userData, refetch } = useGetUserProfileQuery();
  const user = userData?.user || {};

  const { data: distributorData, refetch: distributorRefetch } =
    useGetSuppliersQuery();
  const distributor = distributorData?.distributor;

  // No suppliers available state
  if (user.requestDistributor === "pending") {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="flex justify-center mb-4">
            <Unlink className="w-12 h-12 text-blue-600" />
          </p>
          <h2 className="text-2xl font-semibold mb-3">
            No Suppliers Available
          </h2>
          <p className="text-base mb-6">
            We currently don't have any suppliers connected to your account.
            Please contact the admin or request a Supplier from the dashboard
          </p>
        </div>
      </div>
    );
  }

  // Processing request state
  if (user.requestDistributor === "process") {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Processing Request</h2>
          <p className="text-base mb-4">
            Your supplier request is currently being reviewed by our team.
          </p>
          <p className="text-sm text-gray-500">
            This process typically takes 24-48 hours. We'll notify you once
            approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-65px)]">
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {distributor?.user.name}
                </h1>
                <p className="text-gray-500">Distributor Details</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              icon={MapPin}
              label="Warehouse Address"
              value={distributor?.warehouseDetails?.address}
            />

            <InfoCard
              icon={MapPinned}
              label="Areas Covered"
              value={distributor?.areaCovered?.join(", ")}
            />

            <InfoCard
              icon={FileText}
              label="VAT Number"
              value={distributor?.vat || "Not provided"}
            />

            <InfoCard
              icon={Contact2}
              label="Contact Person"
              value={distributor?.warehouseDetails?.contactPerson}
            />

            <InfoCard icon={Phone} label="Phone" value={user.phone} />

            <InfoCard
              icon={Mail}
              label="Email"
              value={distributor?.user.email}
            />

            <InfoCard
              icon={MapPin}
              label="Zip Code"
              value={distributor?.zipCode}
            />

            <InfoCard
              icon={Clock}
              label="Member Since"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </div>

          {/* Additional Information */}
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">
                  Payment Method
                </h3>
                <p className="text-blue-700 capitalize">{user.paymentMethod}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">
                  Distributor Status
                </h3>
                <p className="text-green-700">
                  {user.isVerified ? "Verified" : "Pending Verification"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ViewSupplier;
