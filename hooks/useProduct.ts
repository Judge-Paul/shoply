import { useQuery } from "@tanstack/react-query";
import api from "@utils/api";
import { Product } from "./useProducts";
import { convertToNaira } from "@utils/currency";

interface UseProductOptions {
  initialTitle?: string;
  initialPrice?: number;
  initialImage?: string;
}

export default function useProduct(
  id: string | string[],
  options?: UseProductOptions,
) {
  const query = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await api.get<Product>(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
    meta: {
      errMessage: "Failed to get product details.",
      errDescription: "Please check your internet connection and try again.",
    },
  });

  const product = query.data
    ? {
        ...query.data,
        image: query.data.images[0],
        displayPrice: convertToNaira(query.data.price),
      }
    : options &&
        (options.initialTitle || options.initialPrice || options.initialImage)
      ? {
          id: Array.isArray(id) ? id[0] : id,
          title: options.initialTitle || "",
          price: options.initialPrice || 0,
          image: options.initialImage || "",
          description: "",
          category: "",
          rating: { rate: 0, count: 0 },
          displayPrice: options.initialPrice
            ? convertToNaira(options.initialPrice)
            : "",
        }
      : null;

  return {
    ...query,
    product,
  };
}
