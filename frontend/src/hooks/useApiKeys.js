import { useQuery } from "@tanstack/react-query";
import { getApiKeys } from "../api/axios";

export const useApiKeys = () => {
  return useQuery({
    queryKey: ["apiKeys"],
    queryFn: getApiKeys,
    staleTime: 1000 * 60 * 10,
  });
};