import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
};

type State = { items: Record<string, CartItem> };

type Action =
  | { type: "ADD"; payload: Omit<CartItem, "quantity">; quantity?: number }
  | { type: "INCREMENT"; id: string }
  | { type: "DECREMENT"; id: string; floor?: number }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

const CartContext = createContext<ReturnType<typeof buildApi> | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const { payload, quantity = 1 } = action;
      const existing = state.items[payload.id];
      const nextQty = (existing?.quantity ?? 0) + quantity;
      return {
        items: {
          ...state.items,
          [payload.id]: { ...payload, quantity: nextQty },
        },
      };
    }
    case "INCREMENT": {
      const item = state.items[action.id];
      if (!item) return state;
      return {
        items: {
          ...state.items,
          [action.id]: { ...item, quantity: item.quantity + 1 },
        },
      };
    }
    case "DECREMENT": {
      const item = state.items[action.id];
      if (!item) return state;

      const floor = action.floor ?? 0;
      const nextQty = item.quantity - 1;

      if (nextQty < floor) {
        if (floor === 0) {
          const items = { ...state.items };
          delete items[action.id];
          return { items };
        }
        return {
          items: {
            ...state.items,
            [action.id]: { ...item, quantity: floor },
          },
        };
      }

      return {
        items: {
          ...state.items,
          [action.id]: { ...item, quantity: nextQty },
        },
      };
    }
    case "REMOVE": {
      const items = { ...state.items };
      delete items[action.id];
      return { items };
    }
    case "CLEAR":
      return { items: {} };
    default:
      return state;
  }
}

function buildApi(state: State, dispatch: React.Dispatch<Action>) {
  const itemsArray = Object.values(state.items);
  const subtotal = itemsArray.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0,
  );
  const totalQuantity = itemsArray.reduce((acc, cur) => acc + cur.quantity, 0);

  return {
    items: itemsArray,
    subtotal,
    totalQuantity,
    addItem: (item: Omit<CartItem, "quantity">, quantity = 1) =>
      dispatch({ type: "ADD", payload: item, quantity }),
    increment: (id: string) => dispatch({ type: "INCREMENT", id }),
    decrement: (id: string, floor = 0) =>
      dispatch({ type: "DECREMENT", id, floor }),
    remove: (id: string) => dispatch({ type: "REMOVE", id }),
    clear: () => dispatch({ type: "CLEAR" }),
    getQty: (id: string) => state.items[id]?.quantity ?? 0,
  };
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { items: {} });
  const value = useMemo(() => buildApi(state, dispatch), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
