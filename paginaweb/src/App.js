import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mapa from "./Mapa.js";
import AgregarMascota from "./AgregarMascota.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/AgregarMascota" element={<AgregarMascota/ >} />
        <Route path="/Mapa" element={<Mapa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;