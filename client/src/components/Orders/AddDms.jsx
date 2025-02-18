import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Search } from "lucide-react";
import ItemCard from "./DmsCard";
import Nav from "./Nav";

import { useCreateJournalMutation } from "@/app/slices/journalApiSlice";
import { useGetJournalQuery } from "@/app/slices/journalApiSlice";
import GroupFormfield from "./Form";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function AddGroup() {
  const [open, setOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [createJournal, { isLoading }] = useCreateJournalMutation();
  const { refetch } = useGetJournalQuery();

  const statusOptions = [
    { value: "In Stock", label: "In Stock" },
    { value: "Low Stock", label: "Low Stock" },
    // { value: "disputed", label: "Disputed" },
  ];

  const categoryOptions = [
    { value: "accommodation", label: "Accommodation" },
    { value: "transport", label: "Transport" },
    { value: "food", label: "Food" },
    { value: "activities", label: "Activities" },
    { value: "shopping", label: "Shopping" },
    { value: "others", label: "Others" },
  ];

  const initialItems = [
    {
      id: 1,
      name: "Premium Electronics",
      category: "Electronics",
      status: "In Stock",
      quantity: 150,
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=500",
    },
    {
      id: 2,
      name: "Organic Food Package",
      category: "Food",
      status: "Low Stock",
      quantity: 50,
      image:
        "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&q=80&w=500",
    },
    {
      id: 3,
      name: "Fashion Apparels",
      category: "Clothing",
      status: "In Stock",
      quantity: 200,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=500",
    },
  ];

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      image: [],
      // status: "pending",
    },
  });

  // const onSubmit = async (data) => {
  //   // Check if imagePreviews is empty

  //   if (imagePreviews.length === 0) {
  //     setErrorMessage("Please upload at least one Receipt.");
  //     return;
  //   }

  //   try {
  //     const updatedData = { ...data };
  //     const res = await createJournal(updatedData).unwrap();
  //     console.log("Journal created:", res);
  //     refetch();
  //     toast.success("Journal entry created successfully!");
  //     setOpen(false);
  //     setImagePreviews([]);
  //   } catch (error) {
  //     console.error("Error creating journal:", error);
  //     toast.error(error?.data?.message || "Failed to create journal entry");
  //   }
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      setErrorMessage("Please select at least one ");
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
            setValue("image", [...(getValues("image") || []), reader.result]);
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
    const currentImages = getValues("image") || [];
    setValue(
      "image",
      currentImages.filter((_, i) => i !== index)
    );

    // Show error if no image are left
    if (imagePreviews.length === 1) {
      setErrorMessage("Please upload at least one image.");
    }
  };

  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setItems([
      ...items,
      { ...data, id: items.length + 1, quantity: Number(data.quantity) },
    ]);
    setOpen(close);
    reset();
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mt-20">
        <Nav />

        {/* Hero */}
        <div className="relative text-white">
          <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-[#4c4fcd] to-[#4338CA]/100 mix-blend-multiply">
            <img
              src="https://img.freepik.com/free-photo/view-inside-new-warehouse-mezzanine-floor-looking-into-hall_181624-25949.jpg?t=st=1739170905~exp=1739174505~hmac=149ab3344c6955d9f15ea76c1a1ce493d60dbdc7a9058d7806a7f9614ad86f8f&w=1060"
              alt="Distribution"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Distribution Management System
            </h1>
            <p className="mt-6 text-xl max-w-3xl">
              Streamline your distribution process with our powerful management
              system.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Add */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="mb-6">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[70vw] overflow-y-auto h-[520px]">
                <DialogHeader>
                  <DialogTitle>Add New Entry</DialogTitle>
                  <DialogDescription>
                    Capture your thoughts, feelings, and moments. All fields
                    help create a richer memory.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  encType="multipart/form-data"
                >
                  <GroupFormfield
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
                    statusOptions={statusOptions}
                    categoryOptions={categoryOptions}
                  />

                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating..." : "Create Group"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
