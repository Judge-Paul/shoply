import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Minus, Plus, Search, X } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import useProducts, { Product } from "hooks/useProducts";
import { useCart } from "context/CartContext";
import SadDog from "@assets/sad-dog.png";
import { BlurView } from "expo-blur";

export default function Products() {
  const {
    categorySlug,
    categoryName,
    searchQuery: initialSearchQuery,
  } = useLocalSearchParams<{
    categorySlug: string;
    categoryName: string;
    searchQuery: string;
  }>();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [isSearching, setIsSearching] = useState(!!initialSearchQuery);

  const {
    data: products,
    isPending: loading,
    isError: error,
    refetch,
    isRefetching,
  } = useProducts({
    categorySlug,
    searchQuery: isSearching ? searchQuery : undefined,
  });

  const { getQty, addItem, increment, decrement } = useCart();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  const getPageTitle = () => {
    if (isSearching && searchQuery) {
      return `Search: ${searchQuery}`;
    }
    return categoryName || "All Products";
  };

  function renderProduct({ item }: { item: Product }) {
    const id = String(item.id);
    const qty = getQty(id);
    return (
      <View className="mb-4 w-[48%] rounded-xl bg-white p-2 shadow-sm">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
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
          <Text className="mb-2 mt-1 text-base font-bold">
            {item.displayPrice}
          </Text>
        </TouchableOpacity>
        <View className="mt-auto">
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

  const getEmptyStateMessage = () => {
    if (error) return "Failed to load products.";
    if (isSearching && searchQuery)
      return `No products found for "${searchQuery}".`;
    return "No products found.";
  };

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
            <Text
              className="flex-1 text-center text-xl font-bold"
              numberOfLines={1}
            >
              {getPageTitle()}
            </Text>
            <View className="w-9" />
          </View>
          <View className="mt-3 flex-row items-center space-x-2 rounded-xl bg-gray-100 px-4 py-3">
            <TouchableOpacity onPress={handleSearch}>
              <Search size={20} color="gray" />
            </TouchableOpacity>
            <TextInput
              placeholder="Search products..."
              className="flex-1 pl-3 text-gray-700"
              placeholderTextColor="#aaa"
              value={searchQuery}
              defaultValue={initialSearchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {(searchQuery || isSearching) && (
              <TouchableOpacity onPress={clearSearch}>
                <X size={20} color="gray" />
              </TouchableOpacity>
            )}
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
        className="pt-28"
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
              {getEmptyStateMessage()}
            </Text>
            {isSearching && searchQuery && (
              <TouchableOpacity
                onPress={clearSearch}
                className="mt-4 rounded-full bg-primary px-6 py-2"
              >
                <Text className="font-semibold text-white">Clear Search</Text>
              </TouchableOpacity>
            )}
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
