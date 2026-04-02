import { useContext, useReducer, createContext } from "react";
import storeReducer, { initialStore } from "../store";

export const StoreContext = createContext();

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
        logout_owner: () => {
            dispatch({ type: "logout_owner" });
        },

        // ==========================================
        // ACCIONES DE RESTAURANTES Y RESERVAS
        // ==========================================

        getOwnerRestaurants: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/owner/restaurants`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_restaurants", payload: data });
                }
            } catch (error) {
                console.error("Error cargando restaurantes del owner:", error);
            }
        },

        // Dentro de flux.js o donde definas tus actions:
getRestaurantBookings: async (resId) => {
    try {
        const resp = await fetch(`${process.env.BACKEND_URL}/api/restaurants/${resId}/bookings`, {
            headers: { "Bypass-Tunnel-Reminder": "true" }
        });
        if (resp.ok) {
            const data = await resp.json();
            dispatch({ type: "set_bookings", payload: data }); 
            return true;
        }
    } catch (error) {
        console.error("Error cargando reservas:", error);
    }
    return false;
},

        updateBookingStatus: async (bookingId, nuevoEstado) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${bookingId}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    },
                    body: JSON.stringify({ estado: nuevoEstado })
                });
                return response.ok;
            } catch (error) {
                console.error("Error actualizando estado de reserva:", error);
                return false;
            }
        },

        // ==========================================
        // TUS ACCIONES EXISTENTES (VENTAS Y MENÚS)
        // ==========================================

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
                    method: "PUT", 
                    headers: { "Content-Type": "application/json" }
                });
                if (response.ok) {
                    const updatedSale = await response.json();
                    dispatch({ type: "update_sale", payload: updatedSale });
                    return true;
                }
            } catch (error) {
                console.error("Error al finalizar:", error);
            }
            return false;
        },

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