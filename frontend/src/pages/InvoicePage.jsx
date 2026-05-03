import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices.js";
import { useGenerateInvoice } from "../hooks/useGenerateInvoice.js";
import { useApiKeys } from "../hooks/useApiKeys.js";

export const InvoicesPage = () => {
  const navigate = useNavigate();

  const { data: invoiceData, isLoading, isError } = useInvoices();
  const { mutate, isPending } = useGenerateInvoice();
  const { data: apiKeysData } = useApiKeys();

  const invoices = invoiceData?.data;
  const apiKeys = apiKeysData?.data;

  console.log("apiKeys", apiKeys);
  console.log(invoices);

  const [form, setForm] = useState({
    apiKey: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(form, {
      onSuccess: () => {
        setForm({ apiKey: "", startDate: "", endDate: "" });
      },
    });
  };

  if (isLoading) return <div className="p-6">Loading invoices...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load invoices</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Invoices</h1>

      {/* ✅ FORM (this was missing) */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 border rounded-lg flex gap-3 items-end"
      >
        <select
          value={form.apiKey}
          onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select API Key</option>
          {apiKeys
            ?.filter((key) => key.status === "active")
            .map((key) => (
              <option key={key.id} value={key.id}>
                {key.apiName}
              </option>
            ))}
        </select>

        <input
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {isPending ? "Generating..." : "Generate"}
        </button>
      </form>

      {/* ✅ LIST */}
      {!invoices || invoices.length === 0 ? (
        <div>No invoices found</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Total Requests</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Created</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-3">{invoice.period}</td>
                  <td className="p-3">{invoice.totalRequests}</td>
                  <td className="p-3">₹{invoice.totalAmount}</td>
                  <td className="p-3">{invoice.createdAt}</td>
                  <td className="p-3">{invoice.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
