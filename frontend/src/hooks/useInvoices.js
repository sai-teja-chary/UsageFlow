import { useQuery } from "@tanstack/react-query";
import { fetchInvoices } from "../api/axios";


export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 1000 * 60 * 5, // 5 min (prevents refetch spam)
  });
};