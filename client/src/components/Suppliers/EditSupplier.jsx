import { useNavigate, useParams } from "react-router-dom";
import {
  useEditSupplierMutation,
  useGetSingleSupplierQuery,
} from "@/app/slices/supplierApiSlice";

import SupplierForm from "./SupplierForm ";
import { toast } from "react-toastify";
import { useState } from "react";

function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: supplier,
    isLoading: isFetching,
    refetch,
  } = useGetSingleSupplierQuery(id);

  const [updateSupplier, { isLoading }] = useEditSupplierMutation();
  const [selectedImage, setSelectedImage] = useState();
  const distributorData = supplier?.distributor || {};

  const handleSubmit = async (data) => {
    data.id = id;

    try {
      const response = await updateSupplier({
        ...data,
        avatar: selectedImage,
      }).unwrap();
      if (response.success) {
        refetch();
        toast.success("Supplier Updated Successfully");
        navigate("/admin/suppliers");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Please upload only JPG, PNG or GIF images");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isFetching) return <div>Loading...</div>;

  return (
    <SupplierForm
      initialData={distributorData}
      initialImage={distributorData?.user?.avatar?.url}
      isEdit={true}
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
      isLoading={isLoading}
      selectedImage={selectedImage}
      onImageChange={handleImageChange}
    />
  );
}
export default EditSupplier;
