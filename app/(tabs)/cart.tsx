import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import { ChevronLeft, Trash2, Minus, Plus } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";

export default function CartScreen() {
  const itemTotal = 730;
  const discount = 50;
  const grandTotal = itemTotal - discount;

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb]">
      <View className="absolute left-0 right-0 top-0 z-10 pt-1">
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
            <Text className="text-xl font-bold">My Cart</Text>
            <View className="w-9" />
          </View>
        </BlurView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-4 pt-16"
        contentContainerClassName="pb-80"
      >
        <CartItem
          title="Dennis Lingo"
          size="L"
          price={250}
          image="https://i.pravatar.cc/150?img=12"
        />
        <CartItem
          title="Red Cotton Shirt"
          size="L"
          price={200}
          image="https://i.pravatar.cc/150?img=5"
        />
        <CartItem
          title="Leather Jacket"
          size="L"
          price={280}
          image="https://i.pravatar.cc/150?img=8"
        />
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-6 py-5 shadow-2xl">
        <View className="flex-row items-center rounded-full bg-gray-100 pl-5">
          <TextInput
            className="flex-1 text-base text-gray-500"
            placeholder="Enter Promocode"
            placeholderTextColor="#b0b0b0"
          />
          <TouchableOpacity className="rounded-full bg-primary px-10 py-5">
            <Text className="text-sm font-semibold text-white">Apply</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-3 gap-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Item Total</Text>
            <Text className="font-medium">${itemTotal}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Discount</Text>
            <Text className="font-medium">-${discount}</Text>
          </View>
          <View className="mt-2 flex-row justify-between border-t border-gray-200 pt-2">
            <Text className="text-lg font-bold">Grand Total</Text>
            <Text className="text-lg font-bold">${grandTotal}</Text>
          </View>
        </View>
        <TouchableOpacity className="mt-6 rounded-full bg-primary py-4">
          <Text className="text-center text-base font-bold text-white">
            Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

type CartItemProps = {
  title: string;
  size: string;
  price: number;
  image: string;
};

export function CartItem({ title, size, price, image }: CartItemProps) {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => {
      const next = prev - 1;
      return next >= 0 ? next : 0;
    });
  };
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow">
      <Image
        source={{ uri: image }}
        className="h-20 w-20 rounded-xl"
        resizeMode="contain"
      />

      <View className="ju flex-1 px-3">
        <Text className="text-base font-semibold">{title}</Text>
        <Text className="mt-1 text-lg font-bold">${price}</Text>
      </View>

      <View className="items-end">
        <TouchableOpacity className={`mb-2 rounded-full p-2`}>
          <Trash2 size={20} color="#f87171" />
        </TouchableOpacity>

        <View className="h-12 min-w-[86px] flex-row items-center justify-center overflow-hidden rounded-full border border-primary">
          <TouchableOpacity
            onPress={handleDecrement}
            className="h-full flex-1 items-center justify-center pl-2.5"
          >
            <Minus size={20} color="gray" />
          </TouchableOpacity>
          <Text className="px-0.5 text-center text-sm font-medium">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={handleIncrement}
            className="h-full flex-1 items-center justify-center pr-2.5"
          >
            <Plus size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
