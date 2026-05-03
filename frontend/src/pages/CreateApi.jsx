import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createApi } from "../api/axios";
import { useNavigate } from "react-router-dom";

export const CreateApi = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    baseUrl: "",
    pricePerRequest: "",
  });

  const mutation = useMutation({
    mutationFn: createApi,
    onSuccess: () => {
      navigate("/my-apis");
    },
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      name: form.name,
      baseUrl: form.baseUrl,
      pricePerRequest: Number(form.pricePerRequest),
    });
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-96"
      >
        <h2 className="text-xl font-semibold mb-4">
          Create API 🚀
        </h2>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="API Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Base URL */}
        <input
          type="text"
          name="baseUrl"
          placeholder="Base URL (https://...)"
          value={form.baseUrl}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />

        {/* Price */}
        <input
          type="number"
          step="0.001"
          name="pricePerRequest"
          placeholder="Price per request"
          value={form.pricePerRequest}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create API"}
        </button>
      </form>
    </div>
  );
};

