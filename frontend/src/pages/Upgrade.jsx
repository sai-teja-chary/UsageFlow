import { useMutation } from "@tanstack/react-query";
import { upgradeUser } from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Upgrade = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: upgradeUser,
    onSuccess: async () => {
      await fetchUser(); // 🔥 refresh user from backend
      navigate("/");     // go back to dashboard
    },
  });

  // 🔒 Prevent owners from accessing this page
  if (user?.role === "owner") {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-600">You are already an owner 🚀</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-6 rounded-xl shadow w-96 text-center">

        <h2 className="text-xl font-semibold mb-4">
          Become an Owner 🚀
        </h2>

        <p className="text-gray-500 mb-6">
          Start creating APIs and earn per request.
        </p>

        <button
          onClick={() => mutation.mutate()}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Upgrading..." : "Upgrade Now"}
        </button>

      </div>
    </div>
  );
};

