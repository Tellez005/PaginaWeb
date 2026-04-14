import './App.css';
import Map from './components/map/Map.jsx';
import { useState } from "react";

function App() {
  const mascotas = [
    {
      //Es el unico que tiene direccion nomas para la prueba
      id: 1,
      nombre: "Jaime",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Se llama Jaime y es un perro",
      imagen: "icons/Prueba1.jpeg",
      lat: 20.6736, 
      lng: -103.4160
      
    },
    {
      id: 2,
      nombre: "Mara",
      raza: "shi tzu", 
      lugar: "Avenida ramon corona 2515",
      descripcion: "No camina mas de 5 minutos sin dormirse",
      imagen: "icons/Mara1.jpeg",
      lat: 20.6736, 
      lng: -103.4160
    },
    {
      id: 3,
      nombre: "Mini mara",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Es hija de mara",
      imagen: "icons/mara3.jpeg"
    },
        {
      id: 4,
      nombre: "Jaime",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Se llama Jaime y es un perro",
      imagen: "icons/Prueba1.jpeg"
    },
    {
      id: 5,
      nombre: "Mara",
      raza: "shi tzu", 
      lugar: "Avenida ramon corona 2515",
      descripcion: "No camina mas de 5 minutos sin dormirse",
      imagen: "icons/Mara1.jpeg"
    },
    {
      id: 6,
      nombre: "Mini mara",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Es hija de mara",
      imagen: "icons/mara3.jpeg"
    },

  ];

  const [mostrarInfoId, setMostrarInfoId] = useState(null);
  const [mostrarCuadro, setMostrarCuadro] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  return (
    <div className='Contenedor'>
      <div className='Barra'>
        <img src='icons/Logo.jpeg' alt="Logo" />
      </div>

      <div className='Contenido'>
        <div className='Panel'>
          <div className='almacendeposts'>

          {mascotas.map((mascota) => (
            <div className='posts' key={mascota.id}>
              <div className='imagenMascota'>
                <button className='botonanimal'
                  onClick={() => {
                    setMostrarCuadro(mostrarCuadro === mascota.id ? null: mascota.id); 
                    setMascotaSeleccionada(mascota); 
                  }}>
                  <img src={mascota.imagen} alt={mascota.nombre}></img>
                </button>
              <div className='titulo'>
                <h3>Nombre: {mascota.nombre}</h3>
              </div>
              {mostrarInfoId === mascota.id && (
              <div className="infoExtra">
                <p>Raza: {mascota.raza}</p>
                <p>descripcion: {mascota.descripcion}</p>
              </div>
              )}
              {mostrarCuadro === mascota.id && (
                <div className='overlay'>
                  <div className='modelo'>
                    <h2>Informacion Adicional</h2>
                    <p>Raza: {mascota.raza}</p>
                    <p>descripcion: {mascota.descripcion} </p>
                    <img src={mascota.imagen} alt={mascota.descripcion}></img>
                    <button onClick={() => setMostrarCuadro(false)}>Cerrar</button>
                  </div> 
                </div>
              )}
              </div>
            </div>
          ))}

          </div>
        </div>

        <div className="App">
          <Map mascotaSeleccionada = {mascotaSeleccionada}/>
        </div>
      </div>
    </div>
  );
}

export default App;