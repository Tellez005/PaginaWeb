import React, { useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Mapa from "./Mapa.js";
import AgregarMascota from "./AgregarMascota.js";
import Login from "./Login.js";
import SignUp from "./SignUp.js"
import ChatPage from "./components/map/ChatPage.jsx";

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuarioLogueado(JSON.parse(usuarioGuardado));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mapa />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element= {<Login />} /> 
        <Route path="/agregarMascota" element={<AgregarMascota/ >} />
        <Route path="/chat" element={<ChatPage currentUser={usuarioLogueado} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;