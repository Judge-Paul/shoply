import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, SlidersHorizontal, Heart } from "lucide-react-native";
import cn from "../../utils/cn";
import { router } from "expo-router";
import Animated from "react-native-reanimated";

const categories = ["All", "Men", "Women", "Kids Wear"];

const products = [
  {
    id: "1",
    title: "Dennis Lingo",
    brand: "Hazzy Rose",
    price: "$250",
    image: "https://i.imgur.com/QkIa5tT.jpeg",
  },
  {
    id: "2",
    title: "Marks & Spencer",
    brand: "Hazzy Rose",
    price: "$140",
    image: "https://i.imgur.com/1twoaDy.jpeg",
  },
  {
    id: "3",
    title: "Trucker Jacket",
    brand: "Hazzy Rose",
    price: "$200",
    image: "https://i.imgur.com/cHddUCu.jpeg",
  },
  {
    id: "4",
    title: "Hooded Jacket",
    brand: "Hazzy Rose",
    price: "$300",
    image: "https://i.imgur.com/cHddUCu.jpeg",
  },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <SafeAreaView className="flex-1 bg-white px-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-lg text-gray-500">Hey 👋🏽</Text>
        </View>

        <Text className="mt-2 text-4xl font-bold">Let's find your</Text>
        <Text className="mb-4 text-4xl font-extrabold">Exclusive Outfit</Text>

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
            activeOpacity={0.5}
            className="flex aspect-square h-full items-center justify-center rounded-xl bg-primary"
          >
            <SlidersHorizontal size={20} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="mb-2 mt-6 text-base font-semibold">
          Top Categories
        </Text>
        <View className="flex-row gap-3 space-x-3">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.7}
              className={cn(
                "rounded-full bg-gray-100 px-6 py-3",
                activeCategory === cat && "bg-primary text-white",
              )}
            >
              <Text
                className={cn(
                  "text-sm text-gray-700",
                  activeCategory === cat && "text-white",
                )}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Products */}
        <View className="mb-3 mt-6 flex-row items-center justify-between">
          <Text className="text-lg font-semibold">Popular Products</Text>
          <Text className="text-sm text-gray-400">View All</Text>
        </View>

        <View className="flex-row flex-wrap justify-between">
          {products.map((item) => (
            <View
              key={item.id}
              className="mb-4 w-[48%] rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
            >
              <Image
                source={{ uri: item.image }}
                className="h-40 w-full rounded-t-lg"
                resizeMode="cover"
              />
              <View className="mt-2 flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold">{item.title}</Text>
                  <Text className="text-xs text-gray-500">{item.brand}</Text>
                </View>
                {/* <Heart size={18} color="gray" /> */}
              </View>
              <Text className="mt-1 text-base font-bold">{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
