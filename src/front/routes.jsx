import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Gerentes } from "./pages/Gerentes";
import NewGerente from "./pages/NewGerente";

// 🔥 IMPORTS QUE TE FALTABAN
import EditGerente from "./pages/EditGerente";
import GerenteDetail from "./pages/GerenteDetail";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/gerentes" element={<Gerentes />} />
      <Route path="/new_gerente" element={<NewGerente />} />

      {/* 🔥 NUEVAS RUTAS */}
      <Route path="/edit_gerente/:id" element={<EditGerente />} />
      <Route path="/gerente/:id" element={<GerenteDetail />} />

    </Route>
  )
);


