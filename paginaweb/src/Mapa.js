import './App.css';
import Map from './components/map/Map.jsx';
import { useEffect, useState } from "react";
import "./Mapa.css";
function Mapa() {
  const [mascotas, setMascotas] = useState([]);
  const [mostrarCuadro, setMostrarCuadro] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/mascotas")
      .then((res) => res.json())
      .then((data) => {
        console.log("Mascotas recibidas:", data);
        setMascotas(data);
      })
      .catch((error) => {
        console.log("Error al obtener mascotas:", error);
      });
  }, []);

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
                  <button
                    className='botonanimal'
                    onClick={() => {
                      setMostrarCuadro(mostrarCuadro === mascota.id ? null : mascota.id);
                      setMascotaSeleccionada(mascota);
                    }}
                  >
                    {mascota.imagen ? (
                      <img
                        src={`http://localhost:3001${mascota.imagen}`}
                        alt={mascota.nombre}
                      />
                    ) : (
                      <div>No hay imagen</div>
                    )}
                  </button>

                  <div className='titulo'>
                    <h3>Nombre: {mascota.nombre}</h3>
                  </div>

                  <p>Raza: {mascota.raza}</p>
                  <p>Edad: {mascota.edad}</p>
                  <p>Descripción: {mascota.descripcion}</p>

                  {mostrarCuadro === mascota.id && (
                    <div className='overlay'>
                      <div className='modelo'>
                        <h2>Información Adicional</h2>
                        <p>Nombre: {mascota.nombre}</p>
                        <p>Raza: {mascota.raza}</p>
                        <p>Edad: {mascota.edad}</p>
                        <p>Descripción: {mascota.descripcion}</p>

                        {mascota.imagen ? (
                          <img
                            src={`http://localhost:3001${mascota.imagen}`}
                            alt={mascota.nombre}
                          />
                        ) : (
                          <p>No hay imagen</p>
                        )}

                        <button onClick={() => setMostrarCuadro(null)}>
                          Cerrar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="App">
          <Map mascotaSeleccionada={mascotaSeleccionada} />
        </div>
      </div>
    </div>
  );
}

export default Mapa;