import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileDown, MoreVertical, Eye, RefreshCw } from "lucide-react";
import { useGetAllPaymentQuery } from "@/app/slices/adminApiSlice";
import { exportToExcel } from "../ExportToExcel";

// Format date to readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
};

export default function PaymentsTable() {
  const { data } = useGetAllPaymentQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter payments based on search term
  const filteredPayments =
    data?.payments?.filter(
      (payment) =>
        payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentMethod
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.pidx.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!data) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full pt-16">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">
              Payment Transactions
            </CardTitle>
            <CardDescription className="text-gray-500">
              Manage and monitor all payment transactions
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => exportToExcel(filteredPayments)}
            >
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments by name, method or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Distributor</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">
                      {payment.user.name}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {payment.pidx.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {payment.order.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {payment.distributor.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.paymentMethod === "Khalti" ? (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            Khalti
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            {payment.paymentMethod}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      {payment.status === "Paid" ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          {payment.status}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No payment records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
