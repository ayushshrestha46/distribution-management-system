import { useState } from "react";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Package } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useGenerateBiilQuery } from "@/app/slices/orderApiSlice";

// Separate the actual invoice content into its own component
function InvoiceContent({ orderId }) {
  const { data } = useGenerateBiilQuery(orderId);
  const billData = data?.billData;

  const qrCodeData = JSON.stringify({
    sellerName: billData?.distributor?.name,
    sellerVAT: billData?.distributor?.vatNo,
    buyerName: billData?.orderSummary?.customerName,
    invoiceNumber: billData?.distributor?.taxInvoice,
    totalVAT: billData?.orderSummary?.vatAmount,
    totalAmount: billData?.orderSummary?.total,
    invoiceDate: billData?.distributor?.issueDate,
  });

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 print:shadow-none print:border-0 relative">
      {/* Header */}
      <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50 print:bg-white relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                TS
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {billData?.distributor?.name}
              </h1>
            </div>
            <p className="text-gray-600 whitespace-pre-line">
              {billData?.distributor?.address}
            </p>
            <div className="mt-4">
              <span className="font-medium">VAT Number:</span>{" "}
              <span className="text-gray-600">
                {billData?.distributor?.vatNo}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 w-full md:w-auto print:shadow-none">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              TAX INVOICE
            </h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-600">Invoice No:</span>{" "}
                <span className="font-medium">
                  {billData?.distributor?.taxInvoice}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Issue Date:</span>{" "}
                <span>{billData?.distributor?.issueDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="p-8 border-b border-gray-200 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-1">
            <h3 className="text-lg font-semibold text-gray-800 ">Bill To :</h3>
            <p className="font-base text-gray-800 ">
              {billData?.orderSummary?.customerName}
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="p-6 overflow-x-auto relative z-10">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700">
              <th className="py-3 px-4 font-semibold rounded-l-lg">
                Description
              </th>
              <th className="py-3 px-4 font-semibold text-right">Qty</th>
              <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
              <th className="py-3 px-4 font-semibold text-right rounded-r-lg">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {billData?.orderSummary?.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-right">Rs. {item.price}</td>
                <td className="py-3 px-4 text-right font-medium">
                  Rs. {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-8 bg-gray-50 border-t border-gray-200 print:bg-white relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="order-2 md:order-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 inline-block print:shadow-none">
              <QRCode
                value={qrCodeData}
                size={128}
                level="H"
                className="border-4 border-white"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                Scan for invoice details
              </p>
            </div>
            <div className="mt-4 max-w-xs">
              <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
              <p className="text-sm text-gray-600">
                Thank you for your business. Please make payment within 15 days
                of invoice date.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2 w-full md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 print:shadow-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    Rs.{" "}
                    {billData?.orderSummary?.total -
                      billData?.orderSummary?.vatAmount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vat Amount:</span>

                  <span className="font-medium">
                    Rs. {billData?.orderSummary?.vatAmount?.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600">
                      Rs.{billData?.orderSummary?.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 text-center text-sm text-gray-500 print:bg-white relative z-10">
        <p>
          This is an electronically generated invoice and does not require a
          signature.
        </p>
      </div>
    </div>
  );
}

// For a logo-based watermark option

// Wrapper component for both dialog view and printable view
export function BillGenerated({ id }) {
  // State to manage print mode
  const [isPrintMode, setIsPrintMode] = useState(false);
  // State to choose watermark type

  // Function to handle print
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      // Reset after printing is done or canceled
      setTimeout(() => setIsPrintMode(false), 500);
    }, 100);
  };

  // If in print mode, show only the invoice content for clean printing
  if (isPrintMode) {
    return (
      <div className="print-only ">
        <InvoiceContent orderId={id} />
      </div>
    );
  }

  // Normal dialog view
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Invoice</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
        <DialogHeader className=" bg  ">
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>Invoice Preview</span>
            <div className="flex items-center gap-4 mr-7">
              <Button onClick={handlePrint} className="print:hidden">
                Print Invoice
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="max-w-5xl mx-auto bg-gray-50 p-6 print:p-0 print:bg-white">
            <InvoiceContent orderId={id} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
