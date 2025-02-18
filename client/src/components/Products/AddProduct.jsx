import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ArrowLeft, Box, Package, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import productImage from "../../../public/order.png";
import { useState } from "react";

function AddProduct() {
  const navigate = useNavigate();
  // Dummy stats data (Replace with API data)
  const stats = {
    totalProducts: 120,
    inStock: 95,
    outOfStock: 25,
    totalCategories: 10,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({});

  const onSubmit = async (data) => {
    try {
      console.log(data);
      toast.success("Product Added Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)]">
      <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8 mt-16">
        {/* Overview Section */}
        {/* Add Product Section */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl flex items-center gap-1 font-bold text-gray-900">
              <img src={productImage} alt="" width={40} />
              Add New Product
            </h1>
            <p className="text-gray-500 mt-1">
              Add a new product to the system
            </p>
          </div>
        </div>

        {/* dash */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
            <Box className="text-blue-600 h-10 w-10" />
            <div>
              <h4 className="text-gray-500 text-sm">Total Products</h4>
              <p className="text-xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
            <Package className="text-green-600 h-10 w-10" />
            <div>
              <h4 className="text-gray-500 text-sm">In Stock</h4>
              <p className="text-xl font-bold">{stats.inStock}</p>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
            <Package className="text-red-600 h-10 w-10" />
            <div>
              <h4 className="text-gray-500 text-sm">Out of Stock</h4>
              <p className="text-xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
            <Layers className="text-yellow-600 h-10 w-10" />
            <div>
              <h4 className="text-gray-500 text-sm">Total Categories</h4>
              <p className="text-xl font-bold">{stats.totalCategories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Product Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <Input
                      {...register("productName", {
                        required: "Product name is required",
                      })}
                      placeholder="Example Product"
                      className={`w-full ${
                        errors.productName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.productName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.productName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <Input
                      {...register("price", {
                        required: "Price is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Enter a valid price",
                        },
                      })}
                      type="number"
                      placeholder="99.99"
                      className={`w-full ${
                        errors.price ? "border-red-500" : ""
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <Input
                      {...register("quantity", {
                        required: "quantity is required",
                      })}
                      type="number"
                      placeholder="99"
                      className={`w-full ${
                        errors.price ? "border-red-500" : ""
                      }`}
                    />
                    {errors.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.quantity.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <Input
                      {...register("category", {
                        required: "Category is required",
                      })}
                      placeholder="Electronics"
                      className={`w-full ${
                        errors.category ? "border-red-500" : ""
                      }`}
                    />
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Stock Status
                    </label>
                    <select
                      {...register("stockStatus", {
                        required: "Stock status is required",
                      })}
                      className="w-full border rounded-md p-2"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                    {errors.stockStatus && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.stockStatus.message}
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
                    onClick={() => navigate("/admin/products")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8"
                  >
                    Add Product
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

export default AddProduct;
