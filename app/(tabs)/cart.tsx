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
import SadDog from "@assets/sad-dog.png";
import { useCart } from "context/CartContext";
import { convertToNaira } from "@utils/currency";
import cn from "@utils/cn";

export default function CartScreen() {
  const { items, subtotal, totalQuantity, increment, decrement, remove } =
    useCart();

  const discount = 0;
  const grandTotal = subtotal - discount;

  return (
    <SafeAreaView className="flex-1 bg-[#f9fafb]">
      <View className="absolute left-0 right-0 top-0 z-10 pt-1">
        <BlurView
          intensity={50}
          tint="light"
          className="px-4 py-3"
          style={{ paddingTop: Platform.OS === "ios" ? 50 : 25 }}
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

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 pt-20">
          <Image source={SadDog} className="h-48 w-48" resizeMode="contain" />
          <Text className="mt-4 text-xl font-semibold">Your cart is empty</Text>
          <Text className="mt-2 text-center text-gray-500">
            Looks like you haven't added anything yet.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 rounded-full bg-primary px-8 py-4"
          >
            <Text className="font-semibold text-white">Start shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="px-4 pt-16"
            contentContainerClassName="pb-80"
          >
            {items.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                image={item.image ?? ""}
                quantity={item.quantity}
                onInc={() => increment(item.id)}
                onDec={() => decrement(item.id, 1)}
                onRemove={() => remove(item.id)}
              />
            ))}
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
                <Text className="text-gray-500">Items ({totalQuantity})</Text>
                <Text className="font-medium">{convertToNaira(subtotal)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Discount</Text>
                <Text className="font-medium">-${discount.toFixed(2)}</Text>
              </View>
              <View className="mt-2 flex-row justify-between border-t border-gray-200 pt-2">
                <Text className="text-lg font-bold">Grand Total</Text>
                <Text className="text-lg font-bold">
                  {convertToNaira(grandTotal)}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="mt-6 rounded-full bg-primary py-4">
              <Text className="text-center text-base font-bold text-white">
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

type CartItemProps = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
};

function CartItem({
  title,
  price,
  image,
  quantity,
  onInc,
  onDec,
  onRemove,
}: CartItemProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow">
      <Image
        source={{ uri: image }}
        className="h-20 w-20 rounded-xl"
        resizeMode="contain"
      />

      <View className="flex-1 px-3">
        <Text className="text-base font-semibold">{title}</Text>
        <Text className="mt-1 text-lg font-bold">{convertToNaira(price)}</Text>
      </View>

      <View className="items-end">
        <TouchableOpacity onPress={onRemove} className="mb-2 rounded-full p-2">
          <Trash2 size={20} color="#f87171" />
        </TouchableOpacity>

        <View className="h-12 min-w-[86px] flex-row items-center justify-center overflow-hidden rounded-full border border-primary">
          <TouchableOpacity
            onPress={onDec}
            disabled={quantity < 2}
            className={cn(
              "h-full flex-1 items-center justify-center pl-2.5",
              quantity < 2 && "text-gray-100",
            )}
          >
            <Minus size={20} color="gray" />
          </TouchableOpacity>
          <Text className="px-0.5 text-center text-sm font-medium">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={onInc}
            className="h-full flex-1 items-center justify-center pr-2.5"
          >
            <Plus size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
