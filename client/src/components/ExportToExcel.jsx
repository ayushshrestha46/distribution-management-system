// ExportToExcel.js
import * as XLSX from "xlsx";

export const exportToExcel = (payments, filename = "payments.xlsx") => {
  if (!payments || payments.length === 0) return;

  const formattedData = payments.map((payment) => ({
    Customer: payment.user?.name || "",
    Amount: payment.amount,
    "Payment ID": payment.pidx,
    Method: payment.paymentMethod,
    Date: new Date(payment.createdAt).toLocaleString("en-US"),
    Status: payment.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

  XLSX.writeFile(workbook, filename);
};
