import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";
import { convertToNaira } from "@utils/currency";

export interface Product {
  id: number;
  title: string;
  price: number;
  displayPrice: string;
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

      const data = res.data.map((product) => ({
        ...product,
        displayPrice: convertToNaira(product.price),
      }));
      return data;
    },
    meta: {
      errMessage: "Failed to get products.",
    },
  });
}
