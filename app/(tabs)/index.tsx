import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Minus, Plus, Search, SlidersHorizontal } from "lucide-react-native";
import cn from "@utils/cn";
import { router } from "expo-router";
import useProducts, { Product } from "hooks/useProducts";
import SadDog from "@assets/sad-dog.png";
import { useCart } from "context/CartContext";
import useCategories from "hooks/useCategories";

const categories = ["All", "Men", "Women", "Kids Wear"];

export default function Home() {
  const {
    data: products,
    isPending: productsLoading,
    isError: productsError,
    refetch,
    isRefetching,
  } = useProducts();

  const { getQty, addItem, increment, decrement } = useCart();

  function renderProduct({ item }: { item: Product }) {
    const id = String(item.id);
    const quantity = getQty(id);
    return (
      <View className="mb-4 w-[48%] justify-between rounded-xl bg-white p-2 shadow-sm">
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
          <Text
            className="mt-2 text-sm font-semibold"
            numberOfLines={2}
            lineBreakMode="tail"
          >
            {item.title}
          </Text>
          <Text className="mt-1 text-base font-bold">{item.displayPrice}</Text>
        </TouchableOpacity>

        <View className="mt-2">
          {quantity > 0 ? (
            <View className="h-10 flex-row items-center justify-between rounded-full px-2">
              <TouchableOpacity
                onPress={() => decrement(id, 0)}
                className="rounded-full bg-primary p-1.5"
              >
                <Minus size={18} color="white" />
              </TouchableOpacity>
              <Text className="text-sm font-medium">{quantity}</Text>
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

  return (
    <SafeAreaView className="bg-background flex-1">
      <FlatList
        data={
          productsError
            ? []
            : productsLoading
              ? (Array.from({ length: 4 }) as Product[])
              : products
        }
        keyExtractor={(_, index) =>
          productsError
            ? ""
            : productsLoading
              ? `skeleton-${index}`
              : products[index].id.toString()
        }
        renderItem={
          productsError
            ? null
            : productsLoading
              ? renderSkeleton
              : renderProduct
        }
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View className="items-center px-4 py-10">
            <Image source={SadDog} className="aspect-square h-60" />
            <Text className="mt-3 text-2xl font-semibold">
              {productsError
                ? "Failed to get products"
                : "No products available yet."}
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

function ListHeader() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const {
    data: categories,
    isPending: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  return (
    <View className="px-4">
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="mb-4 text-3xl font-bold text-gray-500">
          Welcome 👋🏽
        </Text>
      </View>

      <View className="h-16 flex-row items-center gap-2.5 space-x-3">
        <View className="h-full flex-1 flex-row items-center space-x-2 rounded-xl bg-gray-100 px-4 py-3">
          <Search size={20} color="gray" />
          <TextInput
            placeholder="Search"
            className="flex-1 pl-3 text-gray-700"
            placeholderTextColor="#aaa"
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex aspect-square h-full items-center justify-center rounded-xl bg-primary"
        >
          <SlidersHorizontal size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="mb-2 mt-6 text-lg font-bold">Top Categories</Text>
      <View className="flex-row gap-3 space-x-3">
        {categoriesLoading ? (
          <View className="flex-row gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <View key={i} className="items-center">
                <View className="h-24 w-24 animate-pulse rounded-xl bg-gray-200" />
                <View className="mt-2 h-4 w-12 animate-pulse rounded bg-gray-200" />
              </View>
            ))}
          </View>
        ) : categoriesError || !categories || categories.length === 0 ? (
          <View className="w=full h-24 flex-1 items-center justify-center">
            <Text>No categories available.</Text>
          </View>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingRight: 16 }}
            ItemSeparatorComponent={() => <View className="w-4" />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveCategory(item.id)}
                className="items-center"
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: item.image }}
                  className={cn(
                    "h-24 w-24 rounded-xl",
                    activeCategory === item.id && "opacity-90",
                  )}
                  resizeMode="cover"
                />
                <Text
                  className={cn(
                    "mt-2 text-center text-sm font-medium text-gray-700",
                    activeCategory === item.id && "text-primary",
                  )}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View className="mb-3 mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-bold">Popular Products</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text className="text-sm text-gray-400">View All</Text>
        </TouchableOpacity>
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
