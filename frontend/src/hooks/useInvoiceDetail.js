import { useQuery } from "@tanstack/react-query";
import { getInvoiceById } from "../api/axios";

export const useInvoiceDetail = (id) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
};