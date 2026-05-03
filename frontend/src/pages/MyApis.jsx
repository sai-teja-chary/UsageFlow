import { useQuery } from "@tanstack/react-query";
import { getMyApis } from "../api/axios";

const MyApis = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["myApis"],
    queryFn: getMyApis,
  });

  if (isLoading) return <p>Loading your APIs...</p>;

  const apis = data?.data || [];
  console.log(apis)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">My APIs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((api) => (
          <div key={api._id} className="bg-white p-4 rounded-xl shadow">
            {/* 🔹 API Info */}
            <h3 className="text-lg font-semibold">{api.name}</h3>

            <p className="text-sm text-gray-500 mt-1">{api.baseUrl}</p>

            {/* 🔹 Earnings Section (ADD HERE 👇) */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Price</p>
                <p>₹{api.price || 0}</p>
              </div>

              <div>
                <p className="text-gray-500">Requests</p>
                <p>{api.totalRequests || 0}</p>
              </div>

              <div>
                <p className="text-gray-500">Earnings</p>
                <p className="font-semibold text-green-600">
                  ₹{api.totalEarnings || 0}
                </p>
              </div>
            </div>

            {/* 🔹 Footer */}
            <div className="mt-4 text-xs text-gray-400">
              Created: {new Date(api.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {apis.length === 0 && (
        <p className="text-gray-500 mt-4">No APIs created yet</p>
      )}
    </div>
  );
};

export default MyApis;
