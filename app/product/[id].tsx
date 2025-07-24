import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
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
import { useState, useRef, useEffect } from "react";
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
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    setQuantity(1);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const next = prev - 1;
      return next >= 0 ? next : 0;
    });
  };

  const addToCartWidth = useRef(new Animated.Value(1)).current;
  const addToCartOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  const interpolatedWidth = addToCartWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    if (quantity === 1) {
      Animated.parallel([
        Animated.timing(addToCartWidth, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(addToCartOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (quantity === 0) {
      Animated.parallel([
        Animated.timing(addToCartWidth, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(addToCartOpacity, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [quantity]);

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
            <Text className="mt-1 text-xl font-bold">{product.price}</Text>
          </View>
        </View>

        <Text className="mb-2 mt-5 border-t-[1.5px] border-gray-200 pt-5 text-lg font-bold">
          Description
        </Text>
        <Text className="text-sm leading-relaxed text-gray-600">
          {product.description}
          <Text className="text-blue-500"> Read More</Text>
        </Text>

        <Text className="mb-2 mt-5 border-t-[1.5px] border-gray-200 pt-5 text-lg font-bold">
          Select Size
        </Text>
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
        <Animated.View
          style={{
            width: interpolatedWidth,
            opacity: addToCartOpacity,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAddToCart}
            className="h-14 w-full flex-row items-center justify-center gap-3 rounded-full bg-primary"
          >
            <ShoppingCart size={20} color="white" />
            <Text className="text-sm font-semibold text-white">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {quantity > 0 && (
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              opacity: contentOpacity,
              transform: [{ translateY }],
              marginLeft: 12,
              flex: 1,
            }}
          >
            <View className="h-14 w-1/3 flex-row items-center justify-center overflow-hidden rounded-full border border-primary">
              <TouchableOpacity
                onPress={handleDecrement}
                className="h-full flex-1 items-center justify-center"
              >
                <Minus size={20} color="gray" />
              </TouchableOpacity>
              <Text className="px-0.5 text-center text-sm font-medium">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={handleIncrement}
                className="h-full flex-1 items-center justify-center"
              >
                <Plus size={20} color="gray" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/cart")}
              className="ml-2 h-14 flex-1 flex-row items-center justify-center gap-3 rounded-full bg-primary"
            >
              <ShoppingCart size={20} color="white" />
              <Text className="text-sm font-semibold text-white">
                Go to Cart
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}
