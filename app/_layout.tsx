import { Stack } from "expo-router";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  NotifierWrapper,
  Notifier,
  NotifierComponents,
} from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CartProvider } from "@/context/CartContext";

import "./global.css";

const client = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errMessage =
        (query.meta?.errMessage as string) || "An error occurred";
      const errDescription =
        (query.meta?.errDescription as string) ||
        "Please, check your internet connection.";
      Notifier.showNotification({
        title: errMessage,
        description: errDescription,
        hideOnPress: true,
        Component: NotifierComponents.Alert,
        componentProps: {
          alertType: "error",
        },
      });
    },
  }),
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <GestureHandlerRootView>
        <NotifierWrapper>
          <CartProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="product" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </NotifierWrapper>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
