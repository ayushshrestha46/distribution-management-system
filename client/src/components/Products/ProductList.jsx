import { Link, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package2,
  ShoppingCart,
  User,
  Percent,
  LayoutGrid,
  Box,
  Package,
  Layers,
  PenBoxIcon,
  IndianRupee,
  Search,
  FilterX,
  List,
  Grid,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  useGetDistributorProductsQuery,
  useUpdateStockQuantityMutation,
} from "@/app/slices/productApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";

function ProductList() {
  const { data, isLoading, refetch:productRefetch } = useGetDistributorProductsQuery();
  const navigate = useNavigate();
  const products = Array.isArray(data?.products) ? data.products : [];
  const allProducts = [...products].reverse();
  const inStock = allProducts.filter((product) => product?.quantity > 0).length;
  const outStock = products.length - inStock;
  const categories = new Set(allProducts.map((product) => product.category));
  const categoryCount = categories.size;

  // State for search, filters, and view
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  // State for stock updating
  const [stockUpdateValue, setStockUpdateValue] = useState("");
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateStock] = useUpdateStockQuantityMutation();

  // Filter products based on search and active filter
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "inStock")
      return matchesSearch && product.quantity > 0;
    if (activeFilter === "outStock")
      return matchesSearch && product.quantity <= 0;
    if (activeFilter === "category")
      return matchesSearch && product.category === activeFilter;

    return matchesSearch;
  });

  // Function to handle filter changes
  const handleFilterChange = (filter) => {
    setActiveFilter(filter === activeFilter ? "all" : filter);
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter("all");
  };

  // Function to open stock update dialog
  const handleUpdateStockClick = (product) => {
    setSelectedProduct(product);
    setStockUpdateValue(product.quantity.toString());
    setShowUpdateDialog(true);
  };

  // Function to handle stock update submission
  const handleStockUpdate = async () => {
    // Validate input is a number
    if (!/^\d+$/.test(stockUpdateValue)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid number for stock quantity",
      });
      return;
    }

    try {
      // Call the update stock mutation
      const result = await updateStock({
        id: selectedProduct._id,
        quantity: parseInt(stockUpdateValue),
      }).unwrap();

      // Check if the mutation was successful
      if ("data" in result) {
        // Close dialog and reset state
        setShowUpdateDialog(false);
        setSelectedProduct(null);

        // Show success toast
        toast.success("Stock Updated");
        productRefetch()
        // toast({
        //   title: "Stock Updated",
        //   description: `Stock for "${selectedProduct.name}" has been updated to ${stockUpdateValue} units.`,
        //   duration: 3000,
        // });
      } else if ("error" in result) {
        throw new Error(result.error.message || "Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description:
          error.message || "There was an error updating the stock quantity",
      });
    }
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-65px)]">
      <div className="bg-slate-50">
        <div className="container mx-auto py-6">
          {/* Header Section with shadcn Badge */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4 px-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 text-sm">
                    Manage your inventory efficiently
                  </p>
                  <Badge variant="outline" className="ml-2">
                    {products.length} Items
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link to="/distributor/add-product">
                <Button variant="default" size="sm" className="gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Filter Bar with shadcn Input */}
          <div className="bg-white rounded-xl p-4 mb-6 mx-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeFilter === "inStock" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("inStock")}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  In Stock
                </Button>
                <Button
                  variant={
                    activeFilter === "outStock" ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilterChange("outStock")}
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Out of Stock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <FilterX className="h-4 w-4" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                >
                  {viewMode === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards with shadcn Card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Box className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Package className="text-green-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Stock</p>
                  <p className="text-xl font-bold text-gray-900">{inStock}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <Package className="text-red-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-xl font-bold text-gray-900">{outStock}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Layers className="text-yellow-600 h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Categories</p>
                  <p className="text-xl font-bold text-gray-900">
                    {categoryCount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Lists with shadcn components */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <>
              {filteredProducts.length === 0 ? (
                <Card className="mx-4">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No products found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Try changing your search or filter criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="mt-4"
                    >
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Alert for filtered results */}
                  {activeFilter !== "all" || searchTerm.length > 0 ? (
                    <div className="px-4 mb-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Filtered Results</AlertTitle>
                        <AlertDescription>
                          Showing {filteredProducts.length} of{" "}
                          {allProducts.length} products.
                          {activeFilter !== "all" &&
                            ` Filter: ${
                              activeFilter === "inStock"
                                ? "In Stock"
                                : "Out of Stock"
                            }.`}
                          {searchTerm && ` Search: "${searchTerm}"`}
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : null}

                  {/* Tabs for view switching */}
                  <Tabs
                    value={viewMode}
                    onValueChange={setViewMode}
                    className="px-4"
                  >
                    <TabsList className="mb-4">
                      <TabsTrigger value="list" className="gap-2">
                        <List className="h-4 w-4" /> List View
                      </TabsTrigger>
                      <TabsTrigger value="grid" className="gap-2">
                        <Grid className="h-4 w-4" /> Grid View
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="grid">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProducts.map((product) => (
                          <Card key={product._id} className="overflow-hidden">
                            <div className="relative aspect-video bg-gray-100">
                              <img
                                className="w-60 h-60 object-cover"
                                src={product.images[0]?.url}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/300x200?text=No+Image";
                                }}
                              />
                              <Badge
                                className={`absolute top-2 right-2 ${
                                  (product.quantity + product.holdQuantity) > 0
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }`}
                              >
                                {(product.quantity + product.holdQuantity) > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </Badge>
                            </div>

                            <CardHeader className="pb-2">
                              <h3 className="font-medium text-lg text-gray-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {product.description}
                              </p>
                            </CardHeader>

                            <CardContent className="pb-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {product.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                  <Package2 className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {product.quantity + product.holdQuantity} units
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                  <IndianRupee className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    Rs.{product.price}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                  <Percent className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {product.discount}% off
                                  </span>
                                </div>
                              </div>
                            </CardContent>

                            <CardFooter className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                    `/distributor/edit-product/${product._id}`
                                  )
                                }
                              >
                                <PenBoxIcon className="h-4 w-4 mr-2" />
                                Edit
                              </Button>

                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleUpdateStockClick(product)}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Update Stock
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="list">
                      <div className="space-y-4">
                        {filteredProducts.map((product) => (
                          <Card key={product._id}>
                            <div className="flex flex-col md:flex-row">
                              {/* Product Image */}
                              <div className="md:w-1/4 max-w-xs">
                                <div className="relative h-full">
                                  <img
                                    className="w-full h-56 object-cover aspect-[4/3] md:aspect-square rounded-l-lg"
                                    src={product.images[0]?.url}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/300x300?text=No+Image";
                                    }}
                                  />
                                  <Badge
                                    className={`absolute top-2 right-2 ${
                                      (product.quantity + product.holdQuantity) > 0
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-red-100 text-red-800 hover:bg-red-100"
                                    }`}
                                  >
                                    {(product.quantity + product.holdQuantity) > 0
                                      ? "In Stock"
                                      : "Out of Stock"}
                                  </Badge>
                                </div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 p-4 md:p-6">
                                <div className="flex flex-col lg:flex-row justify-between mb-4">
                                  <div>
                                    <h3 className="text-xl font-medium text-gray-900">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                      {product.description}
                                    </p>
                                  </div>
                                  <div className="flex gap-2 mt-3 lg:mt-0">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        navigate(
                                          `/distributor/edit-product/${product._id}`
                                        )
                                      }
                                    >
                                      <PenBoxIcon className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>

                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleUpdateStockClick(product)
                                      }
                                      className="text-blue-700"
                                    >
                                      <Package className="h-4 w-4 mr-2" />
                                      Update Stock
                                    </Button>
                                  </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div className="bg-purple-50 p-3 rounded-lg flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5 text-purple-500" />
                                    <div>
                                      <div className="text-xs text-purple-600">
                                        Category
                                      </div>
                                      <div className="font-medium text-purple-800">
                                        {product.category}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-orange-50 p-3 rounded-lg flex items-center gap-2">
                                    <Package2 className="h-5 w-5 text-orange-500" />
                                    <div>
                                      <div className="text-xs text-orange-600">
                                        Stock
                                      </div>
                                      <div className="font-medium text-orange-800">
                                        {product.quantity + product.holdQuantity} units
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5 text-green-500" />
                                    <div>
                                      <div className="text-xs text-green-600">
                                        Price
                                      </div>
                                      <div className="font-medium text-green-800">
                                        Rs.{product.price}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2">
                                    <Percent className="h-5 w-5 text-red-500" />
                                    <div>
                                      <div className="text-xs text-red-600">
                                        Discount
                                      </div>
                                      <div className="font-medium text-red-800">
                                        {product.discount}% off
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Owner info */}
                                <div className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                                  <User className="h-4 w-4" />
                                  <span>
                                    Owner:{" "}
                                    {product.owner?.warehouseDetails
                                      ?.contactPerson || "Unknown"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stock Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock Quantity</DialogTitle>
            <DialogDescription>
              Update the stock quantity for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package2 className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Current Stock</div>
                <div className="font-medium text-lg">
                  {selectedProduct?.quantity} units
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="stockQuantity"
                className="text-sm font-medium text-gray-700"
              >
                New Stock Quantity
              </label>
              <Input
                id="stockQuantity"
                type="number"
                value={stockUpdateValue}
                onChange={(e) => setStockUpdateValue(e.target.value)}
                min="0"
                className="w-full"
              />
            </div>

            {Number(stockUpdateValue) === 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Setting stock to zero will mark this product as Out of Stock
                </AlertDescription>
              </Alert>
            )}

            {Number(stockUpdateValue) > (selectedProduct?.quantity || 0) && (
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertTitle>Stock Increase</AlertTitle>
                <AlertDescription>
                  You're adding{" "}
                  {Number(stockUpdateValue) - selectedProduct?.quantity} units
                  to inventory
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStockUpdate}>Update Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}

export default ProductList;
