import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export default function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get<Category[]>("/categories");

      return res.data;
    },
    meta: {
      errMessage: "Failed to get categories.",
    },
  });
}
