import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export default function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get<Product[]>("/products");

      return res.data;
    },
    meta: {
      errMessage: "Failed to get products.",
    },
  });
}
