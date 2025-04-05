import { createContext, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

export const CartConext = createContext({
    items: [],
    addItemToCart: () => { },
    updateItemQuantity: () => { },
});

export default function CartContextProvider({ children }) {
    const [shoppingCart, setShoppingCart] = useState({
        items: [],
    });

    function handleAddItemToCart(id) {
        setShoppingCart((prevShoppingCart) => {
            const updatedItems = [...prevShoppingCart.items];

            const existingCartItemIndex = updatedItems.findIndex(
                (cartItem) => cartItem.id === id
            );
            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                };
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                const product = DUMMY_PRODUCTS.find((product) => product.id === id);
                updatedItems.push({
                    id: id,
                    name: product.title,
                    price: product.price,
                    quantity: 1,
                });
            }

            return {
                items: updatedItems,
            };
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        setShoppingCart((prevShoppingCart) => {
            const updatedItems = [...prevShoppingCart.items];
            const updatedItemIndex = updatedItems.findIndex(
                (item) => item.id === productId
            );

            const updatedItem = {
                ...updatedItems[updatedItemIndex],
            };

            updatedItem.quantity += amount;

            if (updatedItem.quantity <= 0) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }

            return {
                items: updatedItems,
            };
        });
    }

    /**
     * We can add either states or functions to the context value.
     */
    const ctxValue = {
        items: shoppingCart.items, // link context with our state
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
    }
    return (
        /**
         * Provider can be omitted from React 19 and above. Must be used for React 18 and below.
         * 
         * !!!WE MUST SET A VALUE PROP!!!
         * The default value set when creating the context is only used if a component that was not wrapped by the Provider component tries to access the context value.
         */
        <CartConext.Provider value={ctxValue}>
            {children}
        </CartConext.Provider>
    );
}