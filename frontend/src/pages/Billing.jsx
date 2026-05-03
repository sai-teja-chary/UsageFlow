import { useQuery } from "@tanstack/react-query";
import { getBillingSummary } from "../api/axios";

const Billing = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: getBillingSummary,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <p>Loading billing...</p>;

  const billing = data?.data;
  console.log("billing",billing);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Billing</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Cost */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Cost</p>
          <h3 className="text-2xl font-semibold mt-2">
            ₹{billing?.totalCost || 0}
          </h3>
        </div>

        {/* Plan */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Plan</p>
          <h3 className="text-xl font-semibold mt-2">
            {billing?.plan || "Free"}
          </h3>
        </div>

        {/* Currency */}
        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-sm text-gray-500">Currency</p>
          <h3 className="text-xl font-semibold mt-2">
            {billing?.currency || "INR"}
          </h3>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Usage Breakdown</h3>

        <table className="w-full text-sm">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="p-3">API</th>
              <th className="p-3">Requests</th>
              <th className="p-3">Cost</th>
            </tr>
          </thead>

          <tbody>
            {billing?.breakdown?.map((item) => (
              <tr key={item.apiId} className="border-t">
                <td className="p-3">{item.apiName}</td>
                <td className="p-3">{item.totalRequests}</td>
                <td className="p-3 font-semibold">₹{item.totalCost}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {billing?.breakdown?.length === 0 && (
          <p className="text-center text-gray-500 p-4">No usage yet</p>
        )}
      </div>
    </div>
  );
};

export default Billing;
