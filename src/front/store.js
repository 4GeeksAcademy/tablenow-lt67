import React from "react";

export const initialStore = () => {
  const tokenOwner = localStorage.getItem("tokenOwner");
  const ownerInfo = localStorage.getItem("ownerInfo");
  const tokenHostess = localStorage.getItem("tokenHostess");
  const hostessInfo = localStorage.getItem("hostessInfo");
  // --- NUEVO: RECUPERAR SESIÓN CLIENTE ---
  const tokenClient = localStorage.getItem("tokenClient");
  const clientInfo = localStorage.getItem("clientInfo");

  return {
    // --- ESTADO OWNER ---
    tokenOwner: tokenOwner || null,
    authOwner: !!tokenOwner,
    ownerInfo: (ownerInfo && ownerInfo !== "undefined") ? JSON.parse(ownerInfo) : null,

    // --- ESTADO (HOSTESS) ---
    tokenHostess: tokenHostess || null,
    authHostess: !!tokenHostess,
    hostessInfo: (hostessInfo && hostessInfo !== "undefined") ? JSON.parse(hostessInfo) : null,
    tables: [],    
    waitlist: [],  

    // --- NUEVO: ESTADO CLIENTE ---
    tokenClient: tokenClient || null,
    authClient: !!tokenClient,
    clientInfo: (clientInfo && clientInfo !== "undefined") ? JSON.parse(clientInfo) : null,
    clientBookings: [],

    // --- ESTADO GENERAL ---
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null },
    ],
    gerentes: [],
    clients: [],
    owners: [],
    sales: [],
    restaurants: [],
    bookings: [],
    menus: [],
    item_ventas: [],
    id: 0,
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    // --- AUTH OWNER ---
    case "login_owner":
      localStorage.setItem("tokenOwner", action.payload.token);
      localStorage.setItem("ownerInfo", JSON.stringify(action.payload.user));
      return {
        ...store,
        tokenOwner: action.payload.token,
        authOwner: true,
        ownerInfo: action.payload.user,
      };

    case "logout_owner":
      localStorage.removeItem("tokenOwner");
      localStorage.removeItem("ownerInfo");
      return {
        ...store,
        tokenOwner: null,
        authOwner: false,
        ownerInfo: null,
        restaurants: [], 
        bookings: [],
      };

    // --- (HOSTESS) ---
    case "set_hostess_auth":
      localStorage.setItem("tokenHostess", action.payload.token);
      localStorage.setItem("hostessInfo", JSON.stringify(action.payload.user));
      return {
        ...store,
        tokenHostess: action.payload.token,
        authHostess: true,
        hostessInfo: action.payload.user,
      };

    case "logout_hostess":
      localStorage.removeItem("tokenHostess");
      localStorage.removeItem("hostessInfo");
      return {
        ...store,
        tokenHostess: null,
        authHostess: false,
        hostessInfo: null,
        tables: [],
        waitlist: [],
      };

    // --- GESTIÓN DE MESAS Y LISTA ---
    case "set_tables":
      return { ...store, tables: action.payload };

    case "set_waitlist":
      return { ...store, waitlist: action.payload };

    // --- RESTO DE ACCIONES (OWNER / GENERAL) ---
    case "set_hello":
      return { ...store, message: action.payload };

    case "set_menus":
      return { ...store, menus: action.payload };

    case "delete_menu_local":
      return {
        ...store,
        menus: store.menus.filter((item) => item.id !== action.payload),
      };

    case "set_sales":
      return { ...store, sales: action.payload };

    case "update_sale":
      return {
        ...store,
        sales: store.sales.map((sale) =>
          sale.id === action.payload.id ? action.payload : sale,
        ),
      };

      case "login_client":
      localStorage.setItem("tokenClient", action.payload.token);
      localStorage.setItem("clientInfo", JSON.stringify(action.payload.user));
      return {
        ...store,
        tokenClient: action.payload.token,
        authClient: true,
        clientInfo: action.payload.user,
      };

    case "logout_client":
      localStorage.removeItem("tokenClient");
      localStorage.removeItem("clientInfo");
      return {
        ...store,
        tokenClient: null,
        authClient: false,
        clientInfo: null,
      };

    case "set_client_info":
    localStorage.setItem("clientInfo", JSON.stringify(action.payload));
    return {
        ...store, 
        clientInfo: action.payload
    };

   case "set_client_bookings":
    return {
        ...store,
        clientBookings: action.payload // <-- Cambia "bookings" por "clientBookings"
    };

    case "set_item_ventas":
      return { ...store, item_ventas: action.payload };

    case "add_item_venta":
      return { ...store, item_ventas: [...store.item_ventas, action.payload] };

    case "remove_item_venta":
      return {
        ...store,
        item_ventas: store.item_ventas.filter(
          (item) => item.id !== action.payload,
        ),
      };

    case "set_restaurants":
      return { ...store, restaurants: action.payload };

    case "set_bookings":
      return { ...store, bookings: action.payload };

    case "set_clients":
      return { ...store, clients: action.payload };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };

    default:
      return store;
  }
}