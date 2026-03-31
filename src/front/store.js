export const initialStore = () => {
  return {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ],
    gerentes: [],
    clients: [],
    owners: [],
    sales: [],
    restaurants: [],
    bookings: [],
    menus: [], 
    id: 0
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return { ...store, message: action.payload };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'set_menus':
      return { ...store, menus: action.payload };

    case 'delete_menu_local':
      return {
        ...store,
        menus: store.menus.filter((item) => item.id !== action.payload)
      };

    case 'set_sales':
      return { ...store, sales: action.payload };

    case 'add_sale':
      return { ...store, sales: [...store.sales, action.payload] };

    case 'set_restaurants':
      return { ...store, restaurants: action.payload };

    case 'set_bookings':
      return { ...store, bookings: action.payload };
    
    case 'set_clients':
      return { ...store, clients: action.payload };

    default:
      return store;
  }
}
