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
        loginHostess: async (email, password) => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login-hostess`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                if (!resp.ok) return false;
                
                const data = await resp.json();
                dispatch({ type: "set_hostess_auth", payload: data });
                return true;
            } catch (error) {
                console.error("Error en login de Hostess:", error);
                return false;
            }
        },

        getAllRestaurantsPublic: async () => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants`);
        if (resp.ok) {
            const data = await resp.json();
            dispatch({ type: "set_restaurants", payload: data });
        }
    } catch (error) {
        console.error("Error cargando restaurantes públicos:", error);
    }
},

        logoutHostess: () => {
            dispatch({ type: "logout_hostess" });
        },

        getTables: async (restauranteId) => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurant/${restauranteId}/tables`);
                if (resp.ok) {
                    const data = await resp.json();
                    dispatch({ type: "set_tables", payload: data });
                }
            } catch (error) {
                console.error("Error cargando mesas:", error);
            }
        },

        updateTableStatus: async (tableId, status) => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/table/${tableId}/status`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenHostess}` 
                    },
                    body: JSON.stringify({ status })
                });
                if (resp.ok) {
                    const nuevasMesas = store.tables.map(t => t.id === tableId ? { ...t, status } : t);
                    dispatch({ type: "set_tables", payload: nuevasMesas });
                    return true;
                }
            } catch (error) {
                console.error("Error actualizando mesa:", error);
            }
            return false;
        },

        getWaitlist: async (restauranteId) => {
            try {
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurant/${restauranteId}/waitlist`);
                if (resp.ok) {
                    const data = await resp.json();
                    dispatch({ type: "set_waitlist", payload: data });
                }
            } catch (error) {
                console.error("Error cargando lista de espera:", error);
            }
        },

        getOwnerProfile: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/owner/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_owner_info", payload: data });
                }
            } catch (error) {
                console.error("Error cargando perfil del dueño:", error);
            }
        },

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
                const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurant/${restauranteId}/bookings`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                if (resp.ok) {
                    const data = await resp.json();
                    dispatch({ type: "set_bookings", payload: data });
                }
            } catch (error) {
                console.error("💥 Error en fetch de reservas:", error);
            }
        },

        createNewBooking: async (bookingData) => {
            try {
                const dataConEstado = { ...bookingData, estado: "pendiente" };
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
                }
            } catch (error) {
                console.error("Error en el fetch de createNewBooking:", error);
            }
            return false;
        },

        deleteBooking: async (bookingId) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking/${bookingId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${store.tokenOwner}` }
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
            } catch (error) {
                console.error("Error en createItemVenta:", error);
            }
            return false;
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

        updateClientImage: async (new_url) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-client-image`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                // CORRECCIÓN: Usar el nombre de token que definiste en el login del cliente
                "Authorization": "Bearer " + localStorage.getItem("tokenClient") 
            },
            body: JSON.stringify({ "image_url": new_url })
        });

        if (resp.ok) {
            // Actualizamos el estado global con la nueva imagen
            dispatch({ 
                type: "set_client_info", 
                payload: { ...store.clientInfo, image_url: new_url } 
            });
            return true;
        } else {
            console.error("Error en la respuesta del servidor:", resp.status);
            return false;
        }
    } catch (error) {
        console.error("Error al guardar la imagen en el backend", error);
        return false;
    }
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