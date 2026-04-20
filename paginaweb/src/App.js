import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mapa from "./Mapa.js";
import AgregarMascota from "./AgregarMascota.js";
import Login from "./Login.js";
import SignUp from "./SignUp.js"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mapa />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element= {<Login />} /> 
        <Route path="/agregarMascota" element={<AgregarMascota/ >} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;