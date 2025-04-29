import { useDispatch } from "react-redux";
import { addToCart } from "@/app/slices/cartSlice";
import { useGetDistributorProductsQuery } from "@/app/slices/productApiSlice";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { LucideUnlink, ShoppingCart, Search, Filter } from "lucide-react";
import {
  useGetUserProfileQuery,
  useRequestDistributorMutation,
} from "@/app/slices/userApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  const { data, isLoading } = useGetDistributorProductsQuery();
  const products = Array.isArray(data?.products) ? data.products : [];
  const allProducts = [...products].reverse();

  const { data: userData, refetch } = useGetUserProfileQuery();
  const user = userData?.user || {};

  const [requestDistributor, { isLoading: isRequestingDistributor }] =
    useRequestDistributorMutation();

  // Extract unique categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(products.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    }
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleRequestSupplier = async () => {
    try {
      const res = await requestDistributor().unwrap();
      if (res.success) {
        toast.success(
          res.messaage || "Supplier request submitted successfully"
        );
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.messaage || "Failed to submit supplier request");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Loading Products...</h2>
        <p className="text-base">
          Please wait while we fetch the latest products.
        </p>
      </div>
    );
  }

  // No suppliers available state
  if (user.requestDistributor === "pending") {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="flex justify-center mb-4">
            <LucideUnlink className="size-12 text-blue-600" />
          </p>
          <h2 className="text-2xl font-semibold mb-3">
            No Suppliers Available
          </h2>
          <p className="text-base mb-6">
            We currently don't have any suppliers connected to your account.
            Request a supplier to access products.
          </p>
          <Button
            onClick={handleRequestSupplier}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            disabled={isRequestingDistributor}
          >
            {isRequestingDistributor ? "Submitting..." : "Request a Supplier"}
          </Button>
        </div>
      </div>
    );
  }

  // Processing request state
  if (user.requestDistributor === "process") {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-center mb-5">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-semibold mb-3">Processing Request</h2>
          <p className="text-base mb-4">
            Your supplier request is currently being reviewed by our team.
          </p>
          <p className="text-sm text-gray-500">
            This process typically takes 24-48 hours. We'll notify you once
            approved.
          </p>
        </div>
      </div>
    );
  }

  // No products found after filtering
  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col h-[70vh] text-center justify-center text-gray-600">
        <div className="flex justify-center mb-4">
          <Search className="size-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
        <p className="text-base mb-4">
          We couldn't find any products matching your search criteria.
        </p>
        <Button
          onClick={() => {
            setSearchTerm("");
            setSelectedCategory("All");
          }}
          className="mx-auto"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  // Main dashboard view
  return (
    <ScrollArea className="h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recently Added Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2">
              Recently Added
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {filteredProducts.length} products found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* All Products Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-4 border-blue-600 pb-2">
              All Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

// Extracted ProductCard component for better organization
const ProductCard = ({ product, handleAddToCart }) => {
  const nav = useNavigate();
  return (
    <div className="bg-white rounded-lg cursor-pointer shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative" onClick={() => nav(`./product/${product?._id}`)}>
        <img
          src={product.images[0]?.url || "/api/placeholder/400/320"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 rounded-tr-lg text-sm font-medium">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </span>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
            onClick={() => handleAddToCart(product)}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
