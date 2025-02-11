import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";

export default function Form({
  control,
  register,
  errors,
  setValue,
  getValues,
  imagePreviews,
  setImagePreviews,
  errorMessage,
  setErrorMessage,
  handleImageChange,
  removeImage,
  statusOptions,
  existingImages,
  categoryOptions,
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-6">
      {/* Left Column */}
      <div className="space-y-4">
        {/* description Field */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-row items-center gap-9">
            <Label htmlFor="title" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Give a name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className="col-span-3"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-500  text-center w-full">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Status Field */}
        <div className="flex items-center gap-8">
          <Label className="text-right">Status</Label>
          <div className="col-span-3 w-full">
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center">{status.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                  {errors.status && (
                    <p className="text-red-500 text-sm">
                      {errors.status.message}
                    </p>
                  )}
                </Select>
              )}
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="flex items-center gap-3">
          <Label className="text-right">Category</Label>
          <div className="col-span-3 w-full">
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center">
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                  {errors.category && (
                    <p className="text-red-500 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </Select>
              )}
            />
          </div>
        </div>

        {/* Quantity Field */}
        <div className="flex items-center gap-4">
          <Label htmlFor="Quantity" className="text-right">
            Quantity
          </Label>
          <div className="col-span-3 relative w-full flex">
            {/* Currency Select */}

            {/* Quantity Input */}
            <Input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Quantity"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 0, message: "Quantity cannot be negative" },
                valueAsNumber: true, // Ensures value is stored as a number
              })}
              min="0"
              className="flex-1 ml-2"
            />
          </div>
        </div>

        {/* Error Handling */}
        {errors.quantity && (
          <p className="text-red-500 text-sm">{errors.quantity.message}</p>
        )}
      </div>

      {/* Right Column - Image Upload */}
      <div className="w-[200px] space-y-4">
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
            Upload Image
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Max size: 5MB per
          </p>
        </div>

        <div className="space-y-2">
          {/* Display existing images */}
          {existingImages?.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md"
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
          {imagePreviews?.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-[120px] w-full object-cover rounded-md"
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

          {/* Display placeholder if no images */}
          {existingImages?.length === 0 && imagePreviews.length === 0 && (
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
    </div>
  );
}
