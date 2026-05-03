import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const original = error.config;

    if (
      window.location.pathname.startsWith("/login") ||
      window.location.pathname.startsWith("/register")
    ) {
      return Promise.reject(error);
    }

    const url = original.url.startsWith("http")
      ? original.url.replace(api.defaults.baseURL, "")
      : original.url;

    if (
      url.startsWith("/api/users/login") ||
      url.startsWith("/api/users/register") ||
      url.startsWith("/api/users/logout") ||
      url.startsWith("/api/users/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await api.post("/api/users/refresh");

        return await api(original);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  },
);

export default api;

export const registerUser = (email, password) =>
  api.post("/api/users/register", { email, password });

export const loginUser = (email, password) =>
  api.post("/api/users/login", { email, password });

export const logoutUser = () => api.post("/api/users/logout");

export const getUser = () => api.get("/api/users/me");

export const getUsageSummary = (params) => 
  api.get("/api/usage/summary", {params});

export const getBillingSummary = (params) => 
  api.get("/api/billing/summary", {params});

export const getApiKeys = () => api.get("/api/keys");

export const revokeApiKey = (id) =>
  api.post(`/api/keys/${id}/revoke`);

export const rotateApiKey = (id) =>
  api.post(`/api/keys/${id}/rotate`);

export const upgradeUser = () =>
  api.post("/api/users/upgrade");

export const createApi = (data) =>
  api.post("/api/apis", data);

export const getMyApis = () =>
  api.get("/api/apis/my-apis");

export const getEarnings = () =>
  api.get("/api/usage/earnings");

export const fetchInvoices = () =>
  api.get("/api/invoice");

export const generateInvoice = (payLoad) =>
  api.post("/api/invoice/generate", payLoad);

export const createApiKey = ({apiId}) =>
  api.post("/api/keys", {apiId});

export const getAllApis = () =>
  api.get("/api/apis");

// api/axios.js

export const getInvoiceById = async (id) => 
  api.get(`/api/invoice/${id}`);

export const payInvoice = async (id) =>
  api.post(`/api/invoice/${id}/pay`);

