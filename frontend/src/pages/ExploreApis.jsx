import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createApiKey, getAllApis } from "../api/axios";


const ExploreApis = () => {
  const [search, setSearch] = useState("");
  const [newKey, setNewKey] = useState(null);

  // 📥 Fetch APIs
  const { data, isLoading } = useQuery({
    queryKey: ["apis"],
    queryFn: getAllApis, // 👉 replace with getAllApis later
  });

  const apis = data?.data || [];

  // 🔑 Create key
  const mutation = useMutation({
    mutationFn: createApiKey,
    onSuccess: (data) => {
      setNewKey(data.data); // show modal
    },
  });

  // 🔍 Filter
  const filteredApis = apis.filter((api) =>
    api.name.toLowerCase().includes(search.toLowerCase())
  );

  console.log(filteredApis);

  if (isLoading) return <p className="p-6">Loading APIs...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Explore APIs</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search APIs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-6 w-full max-w-md rounded"
      />

      {/* 📦 API Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.map((api) => (
          <div
            key={api._id}
            className="border p-4 rounded-lg shadow-sm"
          >
            <h2 className="text-lg font-semibold">{api.name}</h2>

            <p className="text-sm text-gray-500 mt-1">
              {api.baseUrl}
            </p>

            <p className="text-sm mt-2">
              ₹{api.pricePerRequest} / request
            </p>

            <button
              onClick={() => mutation.mutate({ apiId: api._id })}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Generate API Key
            </button>
          </div>
        ))}
      </div>

      {/* 🔐 Modal */}
      {newKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-100">
            <h2 className="font-semibold mb-2">API Key Created</h2>

            <p className="text-sm mb-2 text-red-500">
              ⚠️ Copy this key now. You won’t be able to see it again.
            </p>

            <div className="flex gap-2 mb-4">
              <input
                value={newKey.key}
                readOnly
                className="border p-2 w-full"
              />

              <button
                onClick={() =>
                  navigator.clipboard.writeText(newKey.key)
                }
                className="bg-black text-white px-3 py-2 rounded"
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setNewKey(null)}
              className="w-full bg-gray-200 py-2 rounded"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreApis;