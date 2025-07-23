import { router } from "expo-router";
import { Button, Text, View } from "react-native";
import Animated from "react-native-reanimated";

export default function Product() {
  return (
    <View>
      <View style={{ flex: 1, marginTop: 50 }}>
        <Animated.View
          style={{ width: 100, height: 100, backgroundColor: "green" }}
          sharedTransitionTag="sharedTag"
        />
      </View>
      <Button title="Screen1" onPress={() => router.push("/product")} />
    </View>
  );
}
