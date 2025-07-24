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

interface UseProductsParams {
  categorySlug?: string;
  searchQuery?: string;
}

export default function useProducts(params?: UseProductsParams | string) {
  const { categorySlug, searchQuery } =
    typeof params === "string"
      ? { categorySlug: params, searchQuery: undefined }
      : params || {};

  const queryKey = [
    "products",
    ...(categorySlug ? [{ category: categorySlug }] : []),
    ...(searchQuery ? [{ search: searchQuery }] : []),
  ];

  return useQuery({
    queryKey,
    queryFn: async () => {
      let url = "/products";
      const queryParams: string[] = [];

      if (categorySlug) {
        queryParams.push(`categorySlug=${encodeURIComponent(categorySlug)}`);
      }

      if (searchQuery) {
        queryParams.push(`title=${encodeURIComponent(searchQuery)}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

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
