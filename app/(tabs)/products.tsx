import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Minus, Plus } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import useProducts, { Product } from "hooks/useProducts";
import { useCart } from "context/CartContext";
import SadDog from "@assets/sad-dog.png";
import { BlurView } from "expo-blur";

export default function Products() {
  const { categorySlug, categoryName } = useLocalSearchParams<{
    categorySlug: string;
    categoryName: string;
  }>();
  const {
    data: products,
    isPending: loading,
    isError: error,
    refetch,
    isRefetching,
  } = useProducts(categorySlug);

  const { getQty, addItem, increment, decrement } = useCart();

  function renderProduct({ item }: { item: Product }) {
    const id = String(item.id);
    const qty = getQty(id);
    return (
      <View className="mb-4 w-[48%] rounded-xl bg-white p-2 shadow-sm">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            // navigate to /product/[id]?title=…&price=…&image=…
            router.push({
              pathname: `/product/${item.id}`,
              params: {
                title: item.title,
                price: item.price.toString(),
                image: item.images[0],
              },
            })
          }
        >
          <Image
            source={{ uri: item.images[0] }}
            className="h-40 w-full rounded-t-lg"
            resizeMode="cover"
          />
          <Text className="mt-2 text-sm font-semibold" numberOfLines={2}>
            {item.title}
          </Text>
          <Text className="mt-1 text-base font-bold">{item.displayPrice}</Text>
        </TouchableOpacity>
        <View className="mt-2">
          {qty > 0 ? (
            <View className="flex-row items-center justify-between rounded-full px-2">
              <TouchableOpacity
                onPress={() => decrement(id, 0)}
                className="rounded-full bg-primary p-1.5"
              >
                <Minus size={18} color="white" />
              </TouchableOpacity>
              <Text className="text-sm font-medium">{qty}</Text>
              <TouchableOpacity
                onPress={() => increment(id)}
                className="rounded-full bg-primary p-1.5"
              >
                <Plus size={18} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() =>
                addItem(
                  {
                    id,
                    title: item.title,
                    price: item.price,
                    image: item.images[0],
                  },
                  1,
                )
              }
              className="flex-row items-center justify-center rounded-full bg-primary py-2"
            >
              <Text className="ml-2 text-sm font-semibold text-white">
                Add to Cart
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  function renderSkeleton({ index }: { index: number }) {
    return (
      <View
        key={index}
        className="mb-4 w-[48%] rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
      >
        <View className="h-40 w-full animate-pulse rounded-t-lg bg-gray-200" />
        <View className="mt-2 space-y-1">
          <View className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        </View>
        <View className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-200" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-background flex-1">
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
            <Text className="text-xl font-bold">
              {categoryName || "All Products"}
            </Text>
            <View className="w-9" />
          </View>
        </BlurView>
      </View>
      <FlatList
        data={
          error
            ? []
            : loading
              ? (Array.from({ length: 8 }) as Product[])
              : products
        }
        keyExtractor={(_, i) =>
          error
            ? `error-empty-${i}`
            : loading
              ? `skeleton-${i}`
              : products[i].id.toString()
        }
        className="pt-12"
        renderItem={error ? null : loading ? renderSkeleton : renderProduct}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          <View className="items-center px-4 py-10">
            <Image source={SadDog} className="aspect-square h-60" />
            <Text className="mt-3 text-2xl font-semibold">
              {error ? "Failed to load products." : "No products found."}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#000"]}
            tintColor="#000"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
