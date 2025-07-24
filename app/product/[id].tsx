import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Plus, Minus, ShoppingCart } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import useProduct from "hooks/useProduct";
import SadDog from "assets/sad-dog.png";
import { BlurView } from "expo-blur";
import { useCart } from "context/CartContext";

// const sizes = ["S", "M", "L", "XL"]; // Commented out as requested

export default function ProductDetail() {
  const { id, title, price, image } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : (id as string);

  const router = useRouter();
  const { product, isError } = useProduct(productId, {
    initialTitle: Array.isArray(title) ? title[0] : title,
    initialPrice: price
      ? parseFloat(Array.isArray(price) ? price[0] : price)
      : undefined,
    initialImage: Array.isArray(image) ? image[0] : image,
  });

  const { addItem, increment, decrement, getQty } = useCart();
  const quantity = getQty(productId);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: productId,
        title: product.title ?? "",
        price: product.price ?? 0,
        image: product.image,
      },
      1,
    );
  };

  const handleIncrement = () => increment(productId);
  const handleDecrement = () => decrement(productId);

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

  if (!product && isError) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={35} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Product Details</Text>
          <View className="w-9" />
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Image source={SadDog} className="aspect-square h-60" />
          <Text className="mt-4 text-center text-xl font-semibold">
            Failed to load product
          </Text>
          <Text className="mt-2 w-2/3 text-center text-gray-600">
            Something went wrong while loading the product details.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 w-2/3 items-center rounded-full bg-primary px-6 py-3"
          >
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="absolute left-0 right-0 top-0 z-10">
        <BlurView
          intensity={50}
          tint="light"
          className="px-4 py-3"
          style={{
            paddingTop: Platform.OS === "ios" ? 50 : 25,
          }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={35} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-bold">Product Details</Text>
            <View className="w-9" />
          </View>
        </BlurView>
      </View>
      <ScrollView className="px-4 pt-12" showsVerticalScrollIndicator={false}>
        <View className="mb-6 overflow-hidden rounded-b-3xl bg-gray-200">
          {!product?.image ? (
            <View className="h-80 w-full animate-pulse" />
          ) : (
            <Image source={{ uri: product.image }} className="h-80 w-full" />
          )}
        </View>

        <View className="flex flex-row items-start justify-between">
          <View className="flex-1">
            {!product?.title ? (
              <View className="flex-col gap-2">
                <View className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
                <View className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
              </View>
            ) : (
              <Text className="text-2xl">{product.title}</Text>
            )}
            {!product?.displayPrice ? (
              <View className="mt-4 h-6 w-1/3 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <Text className="mt-4 text-xl font-bold">
                {product.displayPrice}
              </Text>
            )}
          </View>
        </View>

        <Text className="mb-2 mt-5 border-t-[1.5px] border-gray-200 pt-5 text-lg font-bold">
          Description
        </Text>

        {!product?.description ? (
          <View className="flex-col gap-1.5">
            <View className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
            <View className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
            <View className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
            <View className="h-4 w-full animate-pulse rounded-full bg-gray-200" />
          </View>
        ) : (
          <Text className="text-sm leading-relaxed text-gray-600">
            {product.description}
          </Text>
        )}
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
