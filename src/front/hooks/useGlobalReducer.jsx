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
            console.error("Error cargando restaurantes:", error);
        }
    },

        deleteRestaurant: async (id) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                if (response.ok) {
                    const actuales = store.restaurants || [];
                    const filtrados = actuales.filter(r => r.id !== id);
                    dispatch({ type: "set_restaurants", payload: filtrados });
                    return true;
                }
            } catch (error) {
                console.error("Error eliminando restaurante:", error);
            }
            return false;
        },

        updateRestaurant: async (id, nuevoNombre) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    },
                    body: JSON.stringify({ nombre: nuevoNombre })
                });
                if (response.ok) {
                    const data = await response.json();
                    const actuales = store.restaurants || [];
                    const actualizados = actuales.map(r => r.id === id ? { ...r, name: nuevoNombre, nombre: nuevoNombre } : r);
                    dispatch({ type: "set_restaurants", payload: actualizados });
                    return true;
                }
            } catch (error) {
                console.error("Error actualizando restaurante:", error);
            }
            return false;
        },

    getOwnerClients: async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/clients`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`,
                    "Bypass-Tunnel-Reminder": "true"
                }
            });
            if (response.ok) {
                const data = await response.json();
                dispatch({ type: "set_clients", payload: data });
            }
        } catch (error) {
            console.error("Error cargando clientes:", error);
        }
    },
       getBookings: async (restauranteId) => {
            try {
                if (!restauranteId) return;
                
                console.log(`🌐 Pidiendo reservas al backend para el Restaurante ID: ${restauranteId}`);
                
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurant/${restauranteId}/bookings`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                
                if (resp.ok) {
                    const data = await resp.json();
                    console.log("✅ Respuesta de Flask (Reservas):", data); 
                    dispatch({ type: "set_bookings", payload: data });
                } else {
                    console.error("❌ Error del backend. Status:", resp.status);
                }
            } catch (error) {
                console.error("💥 Error en fetch de reservas:", error);
            }
        },

       createNewBooking: async (bookingData) => {
    try {
        const dataConEstado = { 
            ...bookingData, 
            estado: "pendiente" 
        };

        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.tokenOwner}`,
                "Bypass-Tunnel-Reminder": "true"
            },
            body: JSON.stringify(dataConEstado) 
        });

        if (resp.ok) {
            if (bookingData.restaurant_id || bookingData.restaurante_id) {
                actions.getBookings(bookingData.restaurant_id || bookingData.restaurante_id);
            }
            return true;
        } else {
            const errorData = await resp.json();
            console.error("Error del servidor al crear reserva:", errorData);
            return false;
        }
    } catch (error) {
        console.error("Error en el fetch de createNewBooking:", error);
        return false;
    }
},
        
        deleteBooking: async (bookingId) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${bookingId}`, {
    method: "DELETE",
    headers: {
        "Authorization": `Bearer ${store.tokenOwner}`
    }
});

                if (response.ok) {
                    const actuales = store.bookings || [];
                    const nuevasReservas = actuales.filter(b => b.id !== bookingId);
                    dispatch({ type: "set_bookings", payload: nuevasReservas });
                    return true;
                }
            } catch (error) {
                console.error("Error eliminando reserva:", error);
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
        
        if (response.ok) {
            const actuales = store.bookings || [];
            const actualizadas = actuales.map(b => 
                b.id === bookingId ? { ...b, estado: nuevoEstado.toLowerCase(), status: nuevoEstado.toLowerCase() } : b
            );
            dispatch({ type: "set_bookings", payload: actualizadas });
            return true;
        }
    } catch (error) {
        console.error("Error actualizando estado de reserva:", error);
    }
    return false;
},
        

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