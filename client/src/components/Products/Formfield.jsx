import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

export default function Formfield({
  register,
  errors,
  imagePreviews,
  errorMessage,
  handleImageChange,
  removeImage,
  existingImages,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left side: Form Data */}
      <div className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Product Name
          </label>
          <Input
            {...register("name", {
              required: "Product name is required",
            })}
            placeholder="Example Product"
            className={`w-full ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price</label>
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
            className={`w-full ${errors.price ? "border-red-500" : ""}`}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Quantity</label>
          <Input
            {...register("quantity", {
              required: "Quantity is required",
            })}
            type="number"
            placeholder="99"
            className={`w-full ${errors.price ? "border-red-500" : ""}`}
          />
          {errors.quantity && (
            <p className="text-red-500 text-xs mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Input
            {...register("category", {
              required: "Category is required",
            })}
            placeholder="Electronics"
            className={`w-full ${errors.category ? "border-red-500" : ""}`}
          />
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Image Upload */}
      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("photo")?.click()}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload Product Images
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Max size: 5MB per image
          </p>
        </div>
        <div className="space-y-2">
          {/* Display existing images */}
          {existingImages?.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-[120px] justify-self-center  object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={() => removeImage(index, false)} // Remove existing image
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Display new images */}
          <div className="flex flex-wrap space-x-4 justify-self-center overflow-x-auto">
            {imagePreviews?.map((preview, index) => (
              <div key={index} className="relative w-auto">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-[120px] w-auto object-cover  rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => removeImage(index, true)} // Remove new image
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Display placeholder if no images */}
          {/* Display placeholder if no images */}
          {!existingImages?.length && !imagePreviews?.length && (
            <div className="h-[120px] w-full rounded-md border border-dashed border-gray-200 flex items-center justify-center">
              <div className="text-sm text-muted-foreground text-center p-4">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No images uploaded</p>
              </div>
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Product description..."
          rows="4"
          className={`w-full border rounded-md p-2 ${
            errors.description ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}
