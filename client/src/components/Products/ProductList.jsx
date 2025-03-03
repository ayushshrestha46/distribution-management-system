import { Link, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import productImage from "../../../public/order.png";
import {
  Package2,
  DollarSign,
  ShoppingCart,
  User,
  FileText,
  Tag,
  Percent,
  LayoutGrid,
  Box,
  Package,
  Layers,
  PenBoxIcon,
} from "lucide-react";
import { useGetAllProductQuery } from "@/app/slices/productApiSlice";

const stats = {
  totalProducts: 120,
  inStock: 492,
  outOfStock: 30,
  totalCategories: 8,
};

function ProductList() {
  const { data } = useGetAllProductQuery();
  const navigate = useNavigate();
  console.log(data);
  const products = Array.isArray(data?.products) ? data.products : [];
  const allProducts = [...products].reverse();
  const inStock = allProducts.filter((product) => product?.quantity > 0).length;
  const outStock = products.length - inStock
  const categories = new Set(allProducts.map((product) => product.category));
  const categoryCount = categories.size;

  return (
    <ScrollArea className="h-screen">
      <div className="mt-10 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="overflow-auto bg-gray-50 w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex justify-between">
              <div className="flex flex-col gap-1 mb-6">
                <h1 className="text-3xl flex items-center gap-1 font-bold text-gray-900">
                  <img
                    src={productImage}
                    alt="Product"
                    className="h-10 w-10 rounded"
                  />
                  Products
                </h1>
                <p className="text-gray-500 mt-1">
                  Fresh stock updated – grab yours now!
                </p>
              </div>
              <Link to="/distributor/add-product" className="w-full sm:w-auto">
                <Button className="bg-[#2F71F0] hover:bg-[#2F71F0]/90 text-white px-8">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
                <Box className="text-blue-600 h- w-10" />
                <div>
                  <h4 className="text-gray-500 text-sm">Total Products</h4>
                  <p className="text-xl font-bold">{products.length}</p>
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
                <Package className="text-green-600 h-10 w-10" />
                <div>
                  <h4 className="text-gray-500 text-sm">In Stock</h4>
                  <p className="text-xl font-bold">{inStock}</p>
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
                <Package className="text-red-600 h-10 w-10" />
                <div>
                  <h4 className="text-gray-500 text-sm">Out of Stock</h4>
                  <p className="text-xl font-bold">{outStock}</p>
                </div>
              </div>

              <div className="p-4 bg-white shadow-md rounded-lg flex items-center gap-4">
                <Layers className="text-yellow-600 h-10 w-10" />
                <div>
                  <h4 className="text-gray-500 text-sm">Total Categories</h4>
                  <p className="text-xl font-bold">{categoryCount}</p>
                </div>
              </div>
            </div>

            {/* Product Card */}

            {allProducts?.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm  mb-4"
              >
                <div className="md:flex">
                  {/* Product Image */}
                  <div className="md:w-1/3 lg:w-1/4">
                    <img
                      className=" object-fit"
                      src={product.images[0]?.url}
                      width={300}
                      alt={product.images}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 p-3">
                    {/* Header with Status */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <h4 className="text-xl font-medium text-gray-900 flex items-center gap-2">
                          <Tag className="h-5 w5 text-blue-500" />
                          {product.name}
                        </h4>
                        <p className="text-base text-gray-500 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {product.description}
                        </p>
                      </div>
                      <button
                        className="flex gap-2 bg-blue-100 p-1 rounded-sm shadow-md  hover:bg-blue-200"
                        onClick={() => {
                          // setIsDialogOpen(false);

                          navigate(`/distributor/edit-product/${product._id}`);
                        }}
                      >
                        {" "}
                        <PenBoxIcon /> EDIT
                      </button>
                    </div>

                    {/* Main Details Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-1">
                      <div
                        className=" bg-purple-50 
                      "
                      >
                        <div className="flex items-center gap-3  justify-self-center rounded-lg">
                          <ShoppingCart className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="text-sm text-purple-600">
                              Category
                            </div>
                            <div className="font-medium">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className=" bg-orange-50 
                      "
                      >
                        <div className="flex items-center gap-3 justify-self-center rounded-lg">
                          <Package2 className="h-5 w-5 text-orange-500" />
                          <div>
                            <div className="text-sm text-orange-600">Stock</div>
                            <div className="font-medium">
                              {product.quantity} units
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className=" bg-green-50 
                      "
                      >
                        <div className="flex items-center gap-3 justify-self-center  rounded-lg">
                          <DollarSign className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="text-sm text-green-600">Price</div>
                            <div className="font-medium">${product.price}</div>
                          </div>
                        </div>
                      </div>
                      <div
                        className=" bg-red-50 
                      "
                      >
                        <div className="flex items-center gap-3 justify-self-center rounded-lg">
                          <Percent className="h-5 w-5 text-red-500" />
                          <div>
                            <div className="text-sm text-red-600">Discount</div>
                            <div className="font-medium">
                              {product.discount}% off
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IDs Section */}
                    <div className="border-t pt-4 flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                        <User className="h-4 w-4" />
                        <span className="font-mono">
                          Owner: {product.owner?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export default ProductList;
