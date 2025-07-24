import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";

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
        displayPrice: `₦ ${(product.price * 1550).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
      }));
      return data;
    },
    meta: {
      errMessage: "Failed to get products.",
    },
  });
}
