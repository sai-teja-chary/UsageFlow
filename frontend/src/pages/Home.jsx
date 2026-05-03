import { useQuery } from "@tanstack/react-query";
import { getUsageSummary, getBillingSummary, getEarnings } from "../api/axios";
import UsageChart from "../components/dashboard/UsageChart";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Home = () => {
  const { user } = useContext(AuthContext);
  const { data: usageData, isLoading: usageLoading } = useQuery({
    queryKey: ["usage"],
    queryFn: getUsageSummary,
  });

  const { data: billingData, isLoading: billingLoading } = useQuery({
    queryKey: ["billing"],
    queryFn: getBillingSummary,
  });

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: ["earnings"],
    queryFn: getEarnings,
    enabled: user?.role === "owner",
  });

  if (
    usageLoading ||
    billingLoading ||
    (user?.role === "owner" && earningsLoading)
  ) {
    return <p>Loading dashboard...</p>;
  }

  const usage = usageData?.data;
  const billing = billingData?.data;
  const earnings = earningsData?.data || [];

  console.log("usage:", usage);
  console.log("earning:", earnings);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Requests</p>
          <h3 className="text-xl font-semibold mt-1">{usage?.totalRequests}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Successful</p>
          <h3 className="text-xl font-semibold mt-1 text-green-600">
            {usage?.successfulRequests}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Failed</p>
          <h3 className="text-xl font-semibold mt-1 text-red-600">
            {usage?.failedRequests}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Current Cost</p>
          <h3 className="text-xl font-semibold mt-1">
            ${billing?.currentMonthCost}
          </h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Plan</p>
          <h3 className="text-xl font-semibold mt-1">{billing?.plan}</h3>
        </div>
      </div>
      {user?.role === "owner" && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          {earnings?.length === 0 ? (
            <p className="text-gray-500 text-sm">No earnings data yet</p>
          ) : (
            <UsageChart data={earnings} isEarnings />
          )}
        </div>
      )}
      {/* Chart */}
      <div className="mt-6">
        <UsageChart data={usage?.dailyUsage || []} />
      </div>
      
    </div>
  );
};
