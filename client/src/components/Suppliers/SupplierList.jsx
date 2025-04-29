import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import {
  UserPlus,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  Pencil,
  Package,
  Phone,
  Dock,
  Mail,
  PhoneCall,
  Signpost,
  ScrollText,
  Map,
  Shield,
  Calendar,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetAllSupplierQuery } from "@/app/slices/supplierApiSlice";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";

function SupplierList() {
  const { data, isLoading, isError } = useGetAllSupplierQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const navigate = useNavigate();
  const suppliers = Array.isArray(data?.distributors) ? data.distributors : [];
  const sortedSuppliers = [...suppliers].reverse();

  const verifiedSuppliers = suppliers.filter(
    (supplier) => supplier?.user?.isVerified
  ).length;
  const unverifiedSuppliers = suppliers.length - verifiedSuppliers;

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-64px)] bg-blue-150  bg-gradient-to-r from-[#DFECFE] to-[#DFEDFF] p-6 mt-16">
      <div className="mx-auto max-w-7x ">
        {/* Header Section */}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200  mb-10 ">
          <div className="">
            <div className="flex justify-between">
              <div className="">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Suppliers
                </h1>
                <p className="text-gray-700 mb-5">
                  Key partners ensuring a smooth supply chain.
                </p>
              </div>

              <Link to="/admin/add-supplier" className="w-full sm:w-auto">
                <Button className="bg-[#2F71F0] hover:bg-[#2F71F0]/90 text-white px-8">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Supplier
                </Button>
              </Link>
            </div>
            {/* Dashboard Cards */}
            <div className=" ">
              <div className="flex  justify-between gap-6">
                <div className="bg-gray-50 p-4 rounded-xl shadow-md  transition-all hover:shadow-lg">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-green-50 rounded-full ">
                      <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="">
                      <h3 className="text-md text-gray-900">Total Suppliers</h3>
                      <p className="text-2xl  font-bold text-indigo-600 ">
                        {suppliers.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-md  transition-all hover:shadow-lg">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-green-50 rounded-full ">
                      <UserCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="">
                      <h3 className="text-md text-gray-900">
                        Active Suppliers
                      </h3>
                      <p className="text-2xl font-bold text-green-600 ">
                        {verifiedSuppliers}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl shadow-md  transition-all hover:shadow-lg">
                  <div className="flex gap-3 items-center">
                    <div className="p-3 bg-green-50 rounded-full ">
                      <UserX className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="">
                      <h3 className="text-md text-gray-900">
                        Inactive Suppliers
                      </h3>
                      <p className="text-2xl font-bold text-red-600 ">
                        {unverifiedSuppliers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white p-6 rounded-xl h-48 border border-gray-200"
              />
            ))
          ) : isError ? (
            <div className="col-span-full text-center py-12">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load suppliers</p>
            </div>
          ) : sortedSuppliers.length > 0 ? (
            sortedSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-gray-100 overflow-hidden shadow-lg  rounded-lg hover:shadow-lg transition-shadow duration-300"
                onClick={() => {
                  setSelectedSupplier(supplier);
                  setIsDialogOpen(true);
                }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={supplier.user?.avatar?.url}
                    alt={supplier.name}
                    className="w-full h-full object-fit"
                  />
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {supplier.user?.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {/* {supplier.user?.email} */}
                      </p>
                    </div>
                    {supplier?.user?.isVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-4 w-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{supplier.user?.address}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{supplier.user?.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Dock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{supplier.vat}</span>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-4 border-t border-gray-100"
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setIsDialogOpen(true);
                    }}
                  >
                    <button className="w-full bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center">
                      <Package className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mb-4 text-gray-400">No suppliers found</div>
              <Button variant="outline" asChild>
                <Link to="/admin/add-supplier">Add First Supplier</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Supplier Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
            {selectedSupplier && (
              <>
                {/* Header with background */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-white">
                        Supplier Details
                      </DialogTitle>
                    </DialogHeader>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/10 hover:bg-white/20 text-white border-0 mr-3"
                      onClick={() => {
                        setIsDialogOpen(true);
                        navigate(
                          `/admin/edit-supplier/${selectedSupplier._id}`
                        );
                      }}
                    >
                      <Pencil className="w-4 h-4 " />
                      Edit
                    </Button>
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mt-6">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white/20">
                      <img
                        src={selectedSupplier.user.avatar.url}
                        alt={selectedSupplier.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {selectedSupplier.user.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={`${
                            selectedSupplier.user.isVerified
                              ? "bg-emerald-500/20"
                              : "bg-amber-500/20"
                          } text-white hover:bg-white/30 flex items-center gap-1`}
                        >
                          <Shield className="w-3 h-3" />
                          {selectedSupplier.user.isVerified
                            ? "Verified Supplier"
                            : "Pending Verification"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <Mail className="h-5 w-5 text-indigo-600" />
                        <p>Email Address</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.user.email}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>

                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <PhoneCall className="h-5 w-5 text-indigo-600" />
                        <p>Phone Number</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.user.phone}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>
                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                        <p>Location</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.user.address}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>

                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <Signpost className="h-5 w-5 text-indigo-600" />
                        <p>Zip Code</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.zipCode}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>
                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <ScrollText className="h-5 w-5 text-indigo-600" />
                        <p>VAT Number</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.vat}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>
                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <Map className="h-5 w-5 text-indigo-600" />
                        <p>Area Covered</p>
                      </div>
                      <p className="ml-7">{selectedSupplier.areaCovered}</p>
                      <hr className="mt-1 bg-gray-400 w-full ml-1" />
                    </div>
                    <div className="">
                      <div className=" flex gap-2 items-center">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                        <p>Registration Date</p>
                      </div>
                      <p className="ml-7">
                        {new Date(
                          selectedSupplier.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {!selectedSupplier.user.isVerified && (
                    <div className="mt-6 flex gap-3">
                      <Button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => {
                          // Handle approval
                        }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Approve Supplier
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          // Handle rejection
                        }}
                      >
                        Reject Application
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}

export default SupplierList;
