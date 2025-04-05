import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products.js";

export const CartConext = createContext({
    items: [],
    addItemToCart: () => { },
    updateItemQuantity: () => { },
});

/**
 * We do not want it tο be re-created when CartContextProvider re-executes. This is why it is placed outside of function CartContextProvider.
 */
function shoppingCartReducer(state, action) {
    if (action.type === "ADD_ITEM") {
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            ...state, // we can spread the previous state values if we have more than one
            items: updatedItems,
        };
    }

    if (action.type === "UPDATE_ITEM") {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            ...state,
            items: updatedItems,
        };
    }

    return state;
}

export default function CartContextProvider({ children }) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer,
        { items: [] }, // initial state
    );

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: "ADD_ITEM",
            payload: id
        });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: "UPDATE_ITEM",
            payload: {
                productId, // we can ommit the key if the value is the same as the key. Standard JavaScript feature.
                amount,
            }
        });
    }

    /**
     * We can add either states or functions to the context value.
     */
    const ctxValue = {
        items: shoppingCartState.items, // link context with our state
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