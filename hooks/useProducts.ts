import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";
import { convertToNaira } from "@utils/currency";

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  displayPrice?: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    creationAt: string;
    updatedAt: string;
  };
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export default function useProducts(categorySlug?: string) {
  const queryKey = categorySlug
    ? ["products", { category: categorySlug }]
    : ["products"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = categorySlug
        ? `/products?categorySlug=${categorySlug}`
        : "/products";

      const res = await api.get<Product[]>(url);
      const data = res.data.slice(0, 14).map((product) => ({
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
