import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiKeys, revokeApiKey, rotateApiKey } from "../api/axios";

const ApiKeys = () => {
  const queryClient = useQueryClient();

  const [newKey, setNewKey] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["apiKeys"],
    queryFn: getApiKeys,
  });

  const keys = data?.data || [];

  const revokeMutation = useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries(["apiKeys"]);
    },
  });

  const rotateMutation = useMutation({
    mutationFn: rotateApiKey,
    onSuccess: (data) => {
      console.log("ROTATE RESPONSE:", data);

      // ✅ handle both response types
      setNewKey(data.data.newKey || data.data);

      queryClient.invalidateQueries(["apiKeys"]);
    },
  });

  if (isLoading) return <p>Loading API keys...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">API Keys</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">How to use your API keys</h3>

          <p className="text-sm mb-2">
            Use the gateway URL along with your API key:
          </p>

          <pre className="text-xs bg-white p-2 rounded border">
            {`curl -H "x-api-key: YOUR_API_KEY" \\
${import.meta.env.VITE_API_URL}/gateway/{end-points}`}
          </pre>

          <p className="text-xs text-gray-500 mt-2">
            Replace <b>{`{end-points}`}</b> with your API endpoints you want to work with (e.g. ${import.meta.env.VITE_API_URL}/gateway/cat for https://cataas.com/cat)
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Key</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {keys.map((key) => (
              <tr key={key.id} className="border-t">
                <td className="p-3">{key.apiName}</td>

                <td className="p-3 font-mono text-xs">{key.prefix}********</td>

                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      key.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {key.status}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(key.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => {
                      if (!confirm("Rotate this key?")) return;
                      rotateMutation.mutate(key.id); // ✅ FIXED
                    }}
                    disabled={key.status === "revoked"}
                    className="text-xs px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Rotate
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm("Revoke this key?")) return;
                      revokeMutation.mutate(key.id); // ✅ FIXED
                    }}
                    disabled={key.status === "revoked"}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {keys.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No API keys found</p>
        )}
      </div>

      {/* 🔐 MODAL */}
      {newKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-100">
            <h2 className="font-semibold mb-2">New API Key</h2>

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
                onClick={() => navigator.clipboard.writeText(newKey.key)}
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

export default ApiKeys;
