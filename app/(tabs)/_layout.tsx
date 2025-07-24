import { Tabs } from "expo-router";
import { Home, ShoppingCart } from "lucide-react-native";
import { Platform, View } from "react-native";

export default function TabLayout() {
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
            <View className="items-center">
              <ShoppingCart color={color} strokeWidth={focused ? 2.8 : 1.5} />
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
