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
    item_ventas: [], 
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

    // --- MANTENIMIENTO DE MENUS ---
    case 'set_menus':
      return { ...store, menus: action.payload };

    case 'delete_menu_local':
      return {
        ...store,
        menus: store.menus.filter((item) => item.id !== action.payload)
      };

    // --- GESTIÓN DE VENTAS ---
    case 'set_sales':
      return { ...store, sales: action.payload };

    case 'add_sale':
      return { ...store, sales: [...store.sales, action.payload] };

    case 'update_sale':
      return {
        ...store,
        sales: store.sales.map(sale => sale.id === action.payload.id ? action.payload : sale)
      };

    // --- GESTIÓN DE ITEMS DE VENTA ---
    case 'set_item_ventas':
      return { ...store, item_ventas: action.payload };

    case 'add_item_venta':
      return { ...store, item_ventas: [...store.item_ventas, action.payload] };

    case 'remove_item_venta':
      return {
        ...store,
        item_ventas: store.item_ventas.filter(item => item.id !== action.payload)
      };

    // --- OTROS ---
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
