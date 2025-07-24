import { Tabs } from "expo-router";
import { Home, ShoppingCart } from "lucide-react-native";
import { Platform, Text, View } from "react-native";
import { useCart } from "context/CartContext";

export default function TabLayout() {
  const { totalQuantity } = useCart();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#648286",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 70 : 110,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="items-center">
              <Home color={color} strokeWidth={focused ? 2.8 : 1.5} />
              {focused && (
                <View className="mt-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View className="relative items-center justify-center">
              <ShoppingCart color={color} strokeWidth={focused ? 2.8 : 1.5} />
              {totalQuantity > 0 && (
                <View className="absolute -right-2 -top-1.5 min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1.5">
                  <Text className="text-[10px] font-bold text-white">
                    {totalQuantity}
                  </Text>
                </View>
              )}
              {focused && (
                <View className="mt-1 h-1 w-1 rounded-full bg-primary" />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
