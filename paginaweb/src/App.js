import './App.css';
import Map from './components/map/Map.jsx';
import { useState } from "react";

function App() {
  const mascotas = [
    {
      id: 1,
      nombre: "Jaime",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Se llama Jaime y es un perro",
      imagen: "icons/Prueba1.jpeg"
    },
    {
      id: 2,
      nombre: "Mara",
      raza: "chitzu", 
      lugar: "Avenida ramon corona 2515",
      descripcion: "No camina mas de 5 minutos sin dormirse",
      imagen: "icons/Mara1.jpeg"
    },
    {
      id: 3,
      nombre: "Mini mara",
      lugar: "Avenida ramon corona 2515",
      descripcion: "Es hija de mara",
      imagen: "icons/mara3.jpeg"
    }
  ];

  const [mostrarInfo] = useState(null);
  const [mostrarInfoId, setMostrarInfoId] = useState(null);
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

              <div className='titulo'>
                <h3>Nombre: {mascota.nombre}</h3>
                <p>descripcion: {mascota.descripcion}</p>
              </div>

              <div className='imagenMascota'>
                <button className='botonanimal'
                onClick={() => setMostrarInfoId(mostrarInfoId === mascota.id ? null: mascota.id)}>
                  <img src={mascota.imagen} alt={mascota.nombre}></img>
                </button>
              {mostrarInfo && (
                <div className='infoExtra'>
                  <p>Raza: {mascota.raza}</p>

                </div>
              )}
              {mostrarInfoId === mascota.id && (
              <div className="infoExtra">
                <p>Raza: {mascota.raza}</p>
                <p>descripcion: {mascota.descripcion}</p>
              </div>
              )}
              </div>
            </div>
          ))}

          </div>
        </div>

        <div className="App">
          <Map />
        </div>
      </div>
    </div>
  );
}

export default App;