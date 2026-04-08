import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

// GERENTES
import { Gerentes } from "./pages/Gerentes";
import NewGerente from "./pages/NewGerente";
import EditGerente from "./pages/EditGerente";
import GerenteDetail from "./pages/GerenteDetail";

// CLIENTS
import Clients from "./pages/Clients";
import NewClient from "./pages/NewClient"; 
import UpdateClient from "./pages/UpdateClient";
import Client from "./pages/Client";

// OWNERS
import Owners from "./pages/Owners";
import NewOwner from "./pages/NewOwner";
import Owner from "./pages/Owner";
import UpdateOwner from "./pages/UpdateOwner";

// RESTAURANT & MENUS
import { Menu } from "./pages/Menu";

// SALES & ITEM SALES
import { SalesList } from "./pages/SalesList"; 
import { NewSale } from "./pages/NewSale";
import { AddItemsToSale } from "./pages/AddItemsToSale.jsx";

// LOGIN-OWNER
import { LoginOwner } from "./pages/LoginOwner"; 
import { OwnerDashboard } from "./pages/OwnerDashboard";
import { CrearRestaurante } from "./pages/CrearRestaurante";
import { Booking } from "./pages/Booking";
import { NewBooking } from "./pages/NewBooking.jsx";

//HOST
import Host from "./pages/Host";
import NewHost from "./pages/NewHost";
import EditHost from "./pages/EditHost";
import HostDetails from "./pages/HostDetails";

// CLIENT DASHBOARD & AUTH (Importado con llaves según tu archivo anterior)
import { ClientDashboard } from "./pages/ClientDashboard";
import { VistaBusqueda } from "./pages/VistaBusqueda.jsx"; // <--- AGREGA ESTA LÍNEA


export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* HOME */}
      <Route index element={<Home />} />

      {/* GENERALES */}
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* GERENTES */}
      <Route path="/gerentes" element={<Gerentes />} />
      <Route path="/new_gerente" element={<NewGerente />} />
      <Route path="/edit_gerente/:id" element={<EditGerente />} />
      <Route path="/gerente/:id" element={<GerenteDetail />} />

      {/* CLIENTS (Vistas Admin) */}
      <Route path="/clients" element={<Clients />} />
      <Route path="/new_client" element={<NewClient />} />
      <Route path="/buscar" element={<VistaBusqueda />} /> {/* <--- COPIA ESTA LÍNEA */}
      <Route path="/client/:clientId" element={<Client />} />
      <Route path="/edit_client/:clientId" element={<UpdateClient />} />

      {/* OWNERS */}
      <Route path="/owners" element={<Owners />} />
      <Route path="/new_owner" element={<NewOwner />} />
      <Route path="/owner/:ownerId" element={<Owner />} />
      <Route path="/edit_owner/:ownerId" element={<UpdateOwner />} />

      {/* RESTAURANT */}
      <Route path="/menu" element={<Menu />} />

      {/* SALES */}
      <Route path="/sales" element={<SalesList />} />
      <Route path="/new-sale" element={<NewSale />} />
      <Route path="/add-items/:saleId" element={<AddItemsToSale />} />

      {/* LOGIN & DASHBOARDS */}
      <Route path="/login-owner" element={<LoginOwner />} /> 
      <Route path="/owner-dashboard" element={<OwnerDashboard />} />
      
      {/* RUTAS ESPECÍFICAS DE CLIENTE */}
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/signup-client" element={<NewClient />} /> 

      {/* GESTIÓN DE RESTAURANTE */}
      <Route path="/crear-restaurante" element={<CrearRestaurante />} />
      <Route path="/crear-host" element={<h1>Página Crear Hostess</h1>} />
      <Route path="/booking" element={<Booking />} />
      <Route element={<NewBooking />} path="/new-booking" />

      {/* Host */}
      <Route path="/hosts" element={<Host />} />
      <Route path="/create-host" element={<NewHost />} />
      <Route path="/view-host/:id" element={<HostDetails />} />
      <Route path="/edit-host/:id" element={<EditHost />} />

    </Route>
  )
);