import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// import { useAddDentistMutation } from "@/app/slices/adminApiSlice";
import { ScrollArea } from "../ui/scroll-area";
import { useAddSupplierMutation } from "@/app/slices/supplierApiSlice";
function AddSupplier() {
  const navigate = useNavigate();
  const [addSupplier, { isLoading, errors: addErrors }] =
    useAddSupplierMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    try {
      console.log(data);
      // Add your API call here
      const response = await addSupplier(data).unwrap();
      console.log(response);
      if (response.success) {
        toast.success("Supplier Added Successfully");
        // navigate("/admin/all-dentists");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)] ">
      <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8 ">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Supplier
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Supplier
              </h1>
              <p className="text-gray-500 mt-1">
                Register a new Supplier to the system
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Supplier Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Shop Name
                    </label>
                    <Input
                      {...register("name", {
                        required: "Shop is required",
                        pattern: {
                          value: /^[A-Za-z\s]{2,}$/,
                          message: "Please enter a valid shop name",
                        },
                      })}
                      placeholder="Janaki suppliers "
                      className={`w-full ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  {/* ... Rest of the personal information fields ... */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      placeholder="janaki@example.com"
                      className={`w-full ${
                        errors.email ? "border-red-500" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        // pattern: {
                        //   value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        //   message:
                        //     "Password must contain at least one letter and one number",
                        // },
                      })}
                      type="password"
                      placeholder="••••••••"
                      className={`w-full ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <Input
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Input
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 10,
                          message: "Please enter a complete address",
                        },
                      })}
                      placeholder="123 Dang"
                      className={`w-full ${
                        errors.address ? "border-red-500" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <Input
                      {...register("zipCode", {
                        required: "zip Code  is required",
                      })}
                      type="number"
                      placeholder="477442"
                      className={`w-full ${errors.dob ? "border-red-500" : ""}`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-green-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Ware house Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ... Professional information fields ... */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ware house location
                    </label>

                    <Input
                      {...register("location", {
                        required: "Location is required",
                      })}
                      type="text"
                      placeholder="Pokhara"
                      className={`w-full ${
                        errors.location ? "border-red-500" : ""
                      }`}
                    />

                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Contact Person
                    </label>
                    <Input
                      {...register("contact", {
                        required: "Contact is required",
                      })}
                      type="text"
                      placeholder="John Dun "
                      className={`w-full ${
                        errors.experience ? "border-red-500" : ""
                      }`}
                    />
                    {errors.contact && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.contact.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      VAT Number
                    </label>
                    <Input
                      {...register("vat", {
                        required: "VAT Number is required",
                      })}
                      placeholder="V123456"
                      className={`w-full ${
                        errors.nmcNumber ? "border-red-500" : ""
                      }`}
                    />
                    {errors.vat && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.vat.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Area Covered
                    </label>
                    <Input
                      {...register("areaCovered", {
                        required: "Area Covered are required",
                      })}
                      placeholder="ktm"
                      className={`w-full ${
                        errors.areaCovered ? "border-red-500" : ""
                      }`}
                    />
                    {errors.areaCovered && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.areaCovered.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/dentists")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  >
                    Add supplier
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default AddSupplier;
