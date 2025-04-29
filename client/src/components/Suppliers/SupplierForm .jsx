import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image, Plus } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Label } from "@radix-ui/react-label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetAllSupplierQuery } from "@/app/slices/supplierApiSlice";

function SupplierForm({
  initialData,
  initialImage,
  isEdit,
  onSubmit,
  onCancel,
  isLoading,
  selectedImage,
  onImageChange,
}) {
  const initialData1 = {
    name: initialData?.user?.name || "",
    email: initialData?.user?.email || "",
    phone: initialData?.user?.phone || "",
    address: initialData?.user?.address || "",
    location: initialData?.warehouseDetails?.address || "",
    contact: initialData?.warehouseDetails?.contactPerson || "",
  };

  const allData = { ...initialData, ...initialData1 };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: allData,
  });
  const { refetch } = useGetAllSupplierQuery();

  const onSubmitForm = async (data) => {
    try {
      await onSubmit(data);
      reset();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-50px)] mt-12">
      <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8 ">
        <div className="mb-7">
          <Button variant="ghost" onClick={onCancel} className="mb-4">
            <ArrowLeft className="" />
            Back to Suppliers
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? "Edit Supplier" : "Add New Supplier"}
              </h1>
              <p className="text-gray-500 mt-1">
                {isEdit
                  ? "Update supplier information"
                  : "Register a new supplier to the system"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
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
                        required: "Shop name is required",
                        pattern: {
                          value: /^[A-Za-z\s]{2,}$/,
                          message: "Please enter a valid shop name",
                        },
                      })}
                      placeholder="Janaki suppliers"
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

                  <div className="flex flex-col items-center mb-6 relative">
                    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
                      <div className="relative">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={selectedImage || initialImage} />
                          <AvatarFallback>
                            <Image className="w-12 h-12" />
                          </AvatarFallback>
                        </Avatar>

                        <Label
                          htmlFor="picture"
                          className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90"
                        >
                          <Plus className="w-5 h-5" />
                          <Input
                            id="picture"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={onImageChange}
                          />
                        </Label>
                      </div>
                    </div>
                  </div>

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
{/* 
                  {!isEdit && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Input
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
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
                  )} */}

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

                  <div className="space-y-2 ">
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
                        required: "Zip code is required",
                      })}
                      type="number"
                      placeholder="477442"
                      className={`w-full ${
                        errors.zipCode ? "border-red-500" : ""
                      }`}
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
                    Warehouse Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Warehouse location
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
                        required: "Contact person is required",
                      })}
                      type="text"
                      placeholder="John Dun"
                      className={`w-full ${
                        errors.contact ? "border-red-500" : ""
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
                        required: "VAT number is required",
                      })}
                      placeholder="V123456"
                      className={`w-full ${errors.vat ? "border-red-500" : ""}`}
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
                        required: "Area covered is required",
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
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#2F71F0] hover:bg-[#2F71F0]/90 text-white px-8"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : isEdit
                      ? "Save Changes"
                      : "Add Supplier"}
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

export default SupplierForm;
