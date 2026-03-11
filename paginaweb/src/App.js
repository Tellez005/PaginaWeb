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
            <p>Panel izquierdo</p>
          </div>
          <div className="App">
            <Map />
          </div>
      </div>

    </div>
    
  );
}

export default App;
