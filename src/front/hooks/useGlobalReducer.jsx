import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext);

    const actions = {
        // 1. Crear un item en la venta
        createItemVenta: async (itemData) => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/item_ventas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(itemData)
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "add_item_venta", payload: data });
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error en createItemVenta:", error);
                return false;
            }
        },

        
getMenus: async () => {
    try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/menu");
        if (response.ok) {
            const data = await response.json();
            // ¡OJO AQUÍ! El type debe ser "set_menus" para que coincida con store.js
            dispatch({ type: "set_menus", payload: data });
        }
    } catch (error) {
        console.error("Error cargando menús:", error);
    }
},

        deleteItemVenta: async (itemId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/item_ventas/${itemId}`, {
            method: "DELETE"
        });
        if (response.ok) {
            dispatch({ type: "remove_item_venta", payload: itemId });
            return true;
        }
    } catch (error) {
        console.error("Error eliminando item:", error);
    }
    return false;
},

finalizarVenta: async (saleId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sales/${saleId}/checkout`, {
            method: "PUT" // O POST, según como lo definas en tu API
        });
        if (response.ok) {
            const updatedSale = await response.json();
            // Actualizamos la venta en el store para que el total se vea reflejado
            dispatch({ type: "update_sale", payload: updatedSale });
            return true;
        }
    } catch (error) {
        console.error("Error al finalizar venta:", error);
    }
    return false;
},

        // 3. Traer los items de una venta específica
        getItemsBySale: async (saleId) => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/item_ventas/" + saleId);
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_item_ventas", payload: data });
                }
            } catch (error) {
                console.error("Error cargando items:", error);
            }
        }
    };

    return { dispatch, store, actions };
}