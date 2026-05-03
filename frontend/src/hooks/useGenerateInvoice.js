// src/features/invoices/useGenerateInvoice.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateInvoice } from "../api/axios";


export const useGenerateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateInvoice,

    onSuccess: () => {
      // 🔥 refresh invoices list
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};