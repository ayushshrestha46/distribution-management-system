import { useState } from "react";
import { useAllProductsQuery } from "@/app/slices/adminApiSlice";
import { Search, RefreshCw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "react-toastify";
import { ScrollArea } from "../ui/scroll-area";

const AdminProduct = () => {
  const { data, error, isLoading, refetch } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Failed to remove item:", error);
    toast.error(toast.error || "Failed to remove item. Please try again.");

    return;
  }

  // Filter products based on search term
  const filteredProducts =
    data?.products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="p-6 space-y-6 mt-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Box className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Inventories </h1>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

          <ScrollArea className="h-[calc(100vh-190px)]">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">
                      <div className="w-16 rounded-lg">
                        <img
                          src={product.images[0].url}
                          alt=""
                          className="rounded-lg"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>Rs.{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.isActive
                            ? "bg-green-400 hover:bg-green-500"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.owner?.warehouseDetails?.address}
                    </TableCell>
                    <TableCell>{product.owner?.user?.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-gray-500"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
      </div>
        </ScrollArea>
    </div>
  );
};

export default AdminProduct;
