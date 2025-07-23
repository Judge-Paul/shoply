import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function CartScreen() {
  return (
    <View>
      <Text>Cart</Text>
      <Button onPress={() => router.push("/product")} title="Product" />
    </View>
  );
}
