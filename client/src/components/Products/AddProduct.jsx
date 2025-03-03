import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { ArrowLeft, Box, Package, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import productImage from "../../../public/order.png";
import Formfield from "./Formfield";
import { useState } from "react";
import {
  useAddProductMutation,
  useGetAllProductQuery,
} from "@/app/slices/productApiSlice";

function AddProduct() {
  const navigate = useNavigate();
  // Dummy stats data (Replace with API data)
  const stats = {
    totalProducts: 120,
    inStock: 95,
    outOfStock: 25,
    totalCategories: 10,
  };
  const [imagePreviews, setImagePreviews] = useState([]);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const [errorMessage, setErrorMessage] = useState("");
  const [addProduct, { isLoading }] = useAddProductMutation();
  const { refetch } = useGetAllProductQuery();

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      images: [],
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setErrorMessage("Please select at least one image.");
      return;
    }

    let validImages = [];
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
      } else {
        validImages.push(file);
      }
    });

    if (validImages.length > 0) {
      validImages.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImagePreviews((prev) => [...prev, reader.result]);
            setValue("images", [...(getValues("images") || []), reader.result]);
            setErrorMessage(""); // Clear error message
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (imagePreviews.length === 0) {
      setErrorMessage("Please upload at least one valid image.");
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const currentImages = getValues("images") || [];
    setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );

    // Show error if no images are left
    if (imagePreviews.length === 1) {
      setErrorMessage("Please upload at least one image.");
    }
  };

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    try {
      const addData = { ...data };
      const res = await addProduct(addData).unwrap();
      refetch();
      reset();
      setImagePreviews([]);
      toast.success(res.message);
      navigate('/distributor/inventory')
    } catch (error) {
      console.error("Error creating Product:", error);
      toast.error(error?.data?.message || "Failed to create Product entry");
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-25px)]">
      <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="flex  flex-col  gap-4 mb-6">
            <h1 className="text-3xl flex items-center gap-1 font-bold text-gray-900">
              <img src={productImage} alt="" width={40} />
              Add New Product
            </h1>
            <p className="text-gray-500 mt-1">
              Add a new product to the system
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Product Information
                  </h3>
                </div>
                <Formfield
                  control={control}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  getValues={getValues}
                  imagePreviews={imagePreviews}
                  setImagePreviews={setImagePreviews}
                  errorMessage={errorMessage}
                  setErrorMessage={setErrorMessage}
                  handleImageChange={handleImageChange}
                  removeImage={removeImage}
                />
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading} // Disable when loading
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#2F71F0] hover:bg-[#2F71F0]/90 text-white px-8"
                    disabled={isLoading} // Disable when loading
                  >
                    {isLoading ? "Adding..." : "Add Product"}
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
