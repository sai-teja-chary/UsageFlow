// src/features/invoices/InvoiceDetailPage.jsx

import { useParams } from "react-router-dom";
import { useInvoiceDetail } from "../hooks/useInvoiceDetail";
import { usePayInvoice } from "../hooks/usePayInvoice";

export const InvoiceDetailPage = () => {
  const { id } = useParams();

  const { data: invoiceData, isLoading, isError } = useInvoiceDetail(id);
  const { mutate, isPending } = usePayInvoice();

  const invoiceDetail = invoiceData?.data;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-500">Error</div>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Invoice Details</h1>

      <div className="border p-4 rounded-lg mb-6">
        <p><b>Period:</b> {invoiceDetail.periodStart} → {invoiceDetail.periodEnd}</p>
        <p><b>Total Requests:</b> {invoiceDetail.totalRequests}</p>
        <p><b>Total Amount:</b> ₹{invoiceDetail.totalAmount}</p>
        <p>
          <b>Status:</b>{" "}
          <span
            className={`px-2 py-1 text-sm rounded ${
              invoiceDetail.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {invoiceDetail.status}
          </span>
        </p>
      </div>

      {invoiceDetail.status !== "paid" && (
        <button
          onClick={() => mutate(id)}
          disabled={isPending}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {isPending ? "Processing..." : "Pay Now"}
        </button>
      )}
    </div>
  );
};