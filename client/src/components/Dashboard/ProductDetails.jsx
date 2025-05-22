import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/slices/cartSlice";
import { useGetSingleProductQuery } from "@/app/slices/productApiSlice";
import { ArrowLeft, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    shipping: false,
    reviews: false,
  });

  const { data, isLoading, error } = useGetSingleProductQuery(id);
  const product = data?.product || {};

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart?.items || []);

  // Find if this product is already in cart
  const cartItem = cartItems.find((item) => item._id === product._id);

  // Calculate available quantity
  const availableQuantity = product.quantity - (cartItem?.quantity || 0);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImage(0);
    // Reset quantity to 1 when product changes
    setQuantity(1);
  }, [id]);

  const handleAddToCart = () => {
    if (availableQuantity <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    // Create a copy of the product object with the selected quantity
    const productToAdd = {
      ...product,
      selectedQuantity: quantity, // This is the key change - pass the selected quantity in a field the reducer will use
    };

    // Dispatch the action with the product including the selected quantity
    dispatch(addToCart(productToAdd));

    toast.success(`${product.name} (${quantity}) added to cart!`);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleQuantityChange = (action, value = 0) => {
    setQuantity((prev) => {
      if (action === "increment") {
        return Math.min(prev + 1, availableQuantity);
      } else if (action === "decrement") {
        return Math.max(prev - 1, 1);
      } else if (action === "set") {
        return Math.max(1, Math.min(value, availableQuantity));
      }
      return prev;
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="text-red-500 text-6xl mb-4">!</div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Button
            variant="ghost"
            className="flex items-center mr-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        {/* Main product section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={
                    product.images?.[activeImage]?.url ||
                    "/api/placeholder/600/600"
                  }
                  alt={product.name}
                  className=" h-[60vh] w-full object-fit"
                />
              </div>

              {/* Thumbnail images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer border-2 rounded-md overflow-hidden w-20 h-20 flex-shrink-0 transition-all 
                      ${
                        activeImage === index
                          ? "border-blue-600"
                          : "border-gray-200 opacity-70"
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img
                        src={image.url || "/api/placeholder/80/80"}
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="">
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    Rs.{product.discountedPrice?.toFixed(2)}
                  </span>
                  {product.comparePrice && (
                    <span className="ml-3 text-lg text-gray-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}

                  {product.discountPercent?.toFixed(2) > 0 && (
                    <span className="text-xl font-bold text-blue-600 flex flex-col ">
                      <span className="gap-2 flex mr-3  items-center font-medium">
                        <span className="line-through text-gray-400 text-base ">
                          Rs.{product.price?.toFixed(2) || "0.00"}
                        </span>
                        <span className="text-base text-black ">
                          -{product.discountPercent?.toFixed(2) || "0.00"}%
                        </span>
                      </span>
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-gray-600 mb-6">
                  {product.shortDescription ||
                    product.description?.substring(0, 150)}
                </p>

                {/* Category & SKU */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">SKU</p>
                    <p className="font-medium">
                      {product.sku || `SKU-${product.id?.substring(0, 8)}`}
                    </p>
                  </div>
                  {product.brand && (
                    <div>
                      <p className="text-sm text-gray-500">Brand</p>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Available</p>
                    <p className="font-medium">
                      {availableQuantity > 0
                        ? `${availableQuantity} units`
                        : "Out of stock"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-200 pt-6">
                {/* Quantity Selector */}
                {availableQuantity > 0 && (
                  <div className="flex items-center mb-6">
                    <span className="text-gray-700 mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange("decrement")}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={availableQuantity}
                        value={quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value);
                          if (!isNaN(newValue)) {
                            handleQuantityChange("set", newValue);
                          }
                        }}
                        className="w-16 px-2 py-1 border-x border-gray-300 text-center"
                      />
                      <button
                        type="button"
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleQuantityChange("increment")}
                        disabled={quantity >= availableQuantity}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className={`flex-1 py-3 text-lg ${
                      availableQuantity <= 0 ? "bg-red-500" : ""
                    }`}
                    onClick={handleAddToCart}
                    disabled={availableQuantity <= 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {availableQuantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Sections */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="p-6">
            {/* Description Section */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <button
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleSection("description")}
              >
                <h3 className="text-xl font-bold text-gray-800">
                  Product Description
                </h3>
                {expandedSections.description ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {expandedSections.description && (
                <div className="mt-4 text-gray-700 leading-relaxed">
                  <p>{product.description}</p>

                  {/* Features List - if available */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

// Loading state component (unchanged)
const LoadingState = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-24 mr-4" />
        <Skeleton className="h-4 w-16 mr-2" />
        <Skeleton className="h-4 w-4 mx-2" />
        <Skeleton className="h-4 w-16 mr-2" />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <div>
            <Skeleton className="w-full aspect-square rounded-lg mb-4" />
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-md" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex mb-4">
              <Skeleton className="h-5 w-24 mr-2" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>

            <Skeleton className="w-full h-px mb-6" />

            <div className="flex items-center mb-6">
              <Skeleton className="h-5 w-20 mr-4" />
              <Skeleton className="h-10 w-32" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-md" />
              <Skeleton className="h-12 flex-1 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-lg mb-8" />

      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
