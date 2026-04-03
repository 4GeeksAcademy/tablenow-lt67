import React from "react";

export const initialStore = () => {
  const token = localStorage.getItem("tokenOwner");
  const owner = localStorage.getItem("ownerInfo");

  return {
    tokenOwner: token || null,
    authOwner: !!token,
    ownerInfo: (owner && owner !== "undefined") ? JSON.parse(owner) : null,

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