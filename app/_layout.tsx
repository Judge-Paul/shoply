import { Tabs } from "expo-router";
import { Home, ShoppingCart } from "lucide-react-native";

import "./global.css";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "black",
				tabBarInactiveTintColor: "gray",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "",
					tabBarIcon: ({ color }) => <Home color={color} />,
				}}
			/>
			<Tabs.Screen
				name="cart"
				options={{
					title: "",
					tabBarIcon: ({ color }) => <ShoppingCart color={color} />,
				}}
			/>
		</Tabs>
	);
}
