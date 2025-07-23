import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import cn from "@utils/cn";

const sizes = ["S", "M", "L", "XL"];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const product = {
    id,
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?_gl=1*69868j*_ga*MTgzODk2ODY0NC4xNzUzMzA2NTA1*_ga_8JE65Q40S6*czE3NTMzMDY1MDQkbzEkZzEkdDE3NTMzMDY1MTEkajUzJGwwJGgw",
    title: "Dennis Lingo",
    price: "$250",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci, sem feugiat ut nullam nisl orci, volutpat, felis...",
    rating: 4.5,
  };

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={35} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Product Details</Text>
        <View className="w-9" />
      </View>
      <ScrollView className="px-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6 overflow-hidden rounded-b-3xl bg-gray-100">
          <Image
            source={{ uri: product.image }}
            className="h-80 w-full"
            resizeMode="contain"
          />
        </View>

        <View className="flex flex-row items-start justify-between">
          <View>
            <Text className="text-2xl font-semibold">{product.title}</Text>
            <Text className="mb-4 mt-1 text-xl font-bold">{product.price}</Text>
          </View>
          <View className="flex-row items-center gap-4 rounded-full border border-gray-300 px-3 py-3.5">
            <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={20} color="gray" />
            </Pressable>
            <Text className="text-base text-gray-700">{quantity}</Text>
            <Pressable onPress={() => setQuantity(quantity + 1)}>
              <Plus size={20} color="gray" />
            </Pressable>
          </View>
        </View>

        <Text className="mb-2 text-lg font-bold">Description</Text>
        <Text className="text-sm leading-relaxed text-gray-600">
          {product.description}
          <Text className="text-blue-500"> Read More</Text>
        </Text>

        <Text className="mb-2 mt-6 text-lg font-bold">Select Size</Text>
        <View className="flex-row gap-2.5">
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              onPress={() => setSelectedSize(size)}
              activeOpacity={0.7}
              className={cn(
                "rounded-full bg-gray-100 px-5 py-3.5",
                selectedSize === size && "bg-primary text-white",
              )}
            >
              <Text
                className={cn(
                  "text-sm text-gray-700",
                  selectedSize === size && "text-white",
                )}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between px-4 py-4">
        {/* <TouchableOpacity className="h-12 w-12 items-center justify-center rounded-full border border-gray-300">
          <Heart size={22} color="gray" />
        </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="h-14 flex-1 flex-row items-center justify-center gap-3 rounded-full bg-primary"
        >
          <ShoppingCart size={20} color="white" />
          <Text className="text-sm font-semibold text-white">Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
