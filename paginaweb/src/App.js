import logo from './logo.svg';
import './App.css';
import Map from './components/map/Map.jsx';
import { useState } from "react";

function App() {
  const [mostrarInfo, setMostrarInfo] = useState(false);
  return (
    <div className='Contenedor'>
      <div className='Barra'>
        <img src='icons/Logo.jpeg'></img> 
      </div>
      <div className='Contenido'> 
          <div className='Panel'>
            <div className='almacendeposts'>
            <div className='posts'>
              <div className='titulo'>
              <div className='titulo'>
                <h3>Nombre: Jaime<br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: Se llama Jaime y es un perro</p>
              </div>
              </div>
              <div className='imagenMascota'>
                <img src='icons/Prueba1.jpeg'></img>
              </div>
            </div> 
            <div className='posts'>
              <div className='titulo'>
                <h3>Nombre: mara <br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: No camina mas de 5 minutos sin dormirse</p>
              </div>
            <div className='imagenMascota'>
                <button className='botonAnimal'><img src='icons/Mara1.jpeg'></img></button>
            </div>
            </div>
              <div className='posts'>
              <div className='titulo'>
                <h3>Nombre: Mara<br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: Se duerme todo el dia</p>
              </div>
            <div className='imagenMascota'>
                <button className='botonAnimal'><img src='icons/mara2.jpeg'></img></button>
            </div>
            </div>
            <div className='posts'>
              <div className='titulo'>
                  <h3>Nombre: Mini mara<br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: Es hija de mara</p>
              </div>
            <div className='imagenMascota'>
                <button className='botonAnimal'><img src='icons/mara3.jpeg'></img></button>
            </div>
            </div>
              <div className='posts'>
              <div className='titulo'>
                <h3>Nombre: kyra<br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: Ladro todo el dia</p>
              </div>
            <div className='imagenMascota'>
                <button className='botonAnimal'><img src='icons/mara4.jpeg'></img></button>
            </div>
            </div>
            <div className='posts'>
              <div className='titulo'>
                <h3>Nombre: mara<br/> Donde se perdio: Avenida ramon corona 2515</h3>
                <p>Descripcion: Me gusta que me carguen</p>
              </div>
            <div className='imagenMascota'>
                <button className='botonAnimal'><img src='icons/mara5.jpeg'></img></button>
            </div>
            </div>
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
