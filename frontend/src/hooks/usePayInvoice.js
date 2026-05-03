import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payInvoice } from "../api/axios";

export const usePayInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payInvoice,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["invoice", id]);
      queryClient.invalidateQueries(["invoices"]);
    },
  });
};