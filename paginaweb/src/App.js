import logo from './logo.svg';
import './App.css';
import Map from './components/map/Map.jsx';

function App() {
  return (
    <div className='Contenedor'>
      <div className='Barra'>
        <p>Barra Superior</p>
      </div>
      <div className='Contenido'>
          <div className='Panel'>
            <div className='almacendeposts'>
            <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
            </div>
                        <div className='posts'>
                <p>Perro Jaime</p>
                <img src='icons/Prueba1.jpeg'></img>
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
