import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* HOME */}
      <Route path="/" element={<Home />} />

      {/* GENERALES */}
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />

      {/* GERENTES */}
      <Route path="/gerentes" element={<Gerentes />} />
      <Route path="/new_gerente" element={<NewGerente />} />
      <Route path="/edit_gerente/:id" element={<EditGerente />} />
      <Route path="/gerente/:id" element={<GerenteDetail />} />

      {/* CLIENTS */}
      <Route path="/clients" element={<Clients />} />
      <Route path="/new_client" element={<NewClient />} />
      <Route path="/client/:clientId" element={<Client />} />
      <Route path="/edit_client/:clientId" element={<UpdateClient />} />

    </Route>
  )
);
