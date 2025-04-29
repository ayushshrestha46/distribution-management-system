import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetSingleProductQuery,
  useGetDistributorProductsQuery,
  useEditProductMutation,
} from "@/app/slices/productApiSlice";
import Formfield from "./Formfield";
import productImage from "../../../public/order.png";
import { ScrollArea } from "../ui/scroll-area";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]); // Store existing images
  const [imagePreviews, setImagePreviews] = useState([]); // Store new images

  const [errorMessage, setErrorMessage] = useState("");

  const [updateProduct, { isLoading: isUpdating }] = useEditProductMutation();
  const {
    data: productData,
    refetch: editrefetch,
    isLoading: isLoadingProduct,
  } = useGetSingleProductQuery(id);
  const { refetch } = useGetDistributorProductsQuery();

  const product = productData?.product || {};

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: product,
  });

  useEffect(() => {
    if (product) {
      reset(product);
    }
    if (product.images && Array.isArray(product.images)) {
      setExistingImages(product.images.map((img) => img.url)); // Set existing images safely
    } else {
      setExistingImages([]); // Set as empty array if images are undefined
    }
  }, [product, reset]);

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0 && existingImages.length === 0) {
      setErrorMessage("Please upload at least one image.");
      return;
    }
    try {
      const response = await updateProduct({
        ...data,
        id,
        images: [...existingImages, ...imagePreviews],
      }).unwrap();
      if (response.success) {
        refetch();
        editrefetch();
        reset();
        toast.success(response.message);
        navigate("/distributor/inventory");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error?.data?.message || "Failed to update product entry");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} exceeds 5MB limit`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreviews((prev) => [...prev, reader.result]); // Store new images
          setValue("images", [...(getValues("images") || []), reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index, isNewImage) => {
    if (isNewImage) {
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      const currentImages = getValues("images") || [];
      setValue(
        "images",
        currentImages.filter((_, i) => i !== index)
      );
    } else {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-65px)]">
      <div className="min-h-screen bg-gray-50  p-8">
        <div className="mb-5 ml-2">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>

          <div className="flex  flex-col   mb-2">
            <h1 className="text-3xl flex items-center gap-1 font-bold text-gray-900">
              <img src={productImage} alt="" width={40} />
              Edit Product
            </h1>
            <p className="text-gray-500 mt-1">Edit a Product to the system</p>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                existingImages={existingImages}
              />
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#2867EC] hover:bg-[#2867EC]/90 text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Product Entry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
