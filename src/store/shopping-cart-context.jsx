import { createContext } from "react";

export const CartConext = createContext({
    items: [],
    addItemToCart: () => { },
    updateItemQuantity: () => { },
});