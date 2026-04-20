import './App.css';
import Map from './components/map/Map.jsx';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import "./Mapa.css";

function Mapa() {
  const [mascotas, setMascotas] = useState([]);
  const [mostrarCuadro, setMostrarCuadro] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [razaFiltro, setRazaFiltro] = useState("Todas");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarMenuLogin, setMostrarMenuLogin] = useState(false);

  const navigate = useNavigate();
  const postsPorPagina = 15;

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

  const razasBase = [
    "Mestizo",
    "Chihuahua",
    "Schnauzer",
    "Golden Retriever",
    "Labrador Retriever",
    "Pug",
    "Yorkshire Terrier",
    "Poodle",
    "Pastor Alemán",
    "Bulldog Francés",
    "Bulldog Inglés",
    "Pitbull",
    "Husky Siberiano",
    "Beagle",
    "Rottweiler",
    "Shih Tzu",
    "Maltés",
    "Cocker Spaniel",
    "Doberman",
    "Dálmata",
    "Boxer",
    "Border Collie",
    "Akita Inu",
    "Samoyedo",
    "Weimaraner",
    "Basset Hound",
    "Gran Danés",
    "Chow Chow",
    "Jack Russell Terrier",
    "Bull Terrier",
    "Pomerania",
    "Shar Pei",
    "Setter Irlandés",
    "Galgo",
    "Terrier Escocés",
    "Fox Terrier",
    "Boston Terrier",
    "American Staffordshire Terrier",
    "Cane Corso",
    "Mastín Napolitano",
    "Xoloitzcuintle",
    "Perro sin pelo peruano",
    "Chihuahua de pelo largo",
    "Pastor Belga",
    "Vizsla",
    "Pointer Inglés",
    "Airedale Terrier",
    "Collie",
    "Whippet",
    "Kangal"
  ];

  const opcionesFiltro = ["Todas", ...razasBase, "Otra"];

  function esRazaConocida(raza) {
    if (!raza) return false;

    return razasBase.some(
      (razaBase) => razaBase.toLowerCase() === raza.toLowerCase()
    );
  }

  const mascotasFiltradas = useMemo(() => {
    return mascotas.filter((mascota) => {
      const coincideNombre = mascota.nombre
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());

      let coincideRaza = false;

      if (razaFiltro === "Todas") {
        coincideRaza = true;
      } else if (razaFiltro === "Otra") {
        coincideRaza = !esRazaConocida(mascota.raza);
      } else {
        coincideRaza = mascota.raza?.toLowerCase() === razaFiltro.toLowerCase();
      }

      return coincideNombre && coincideRaza;
    });
  }, [mascotas, busqueda, razaFiltro]);

  const totalPaginas = Math.ceil(mascotasFiltradas.length / postsPorPagina);
  const indiceInicial = (paginaActual - 1) * postsPorPagina;
  const indiceFinal = indiceInicial + postsPorPagina;
  const mascotasPaginadas = mascotasFiltradas.slice(indiceInicial, indiceFinal);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, razaFiltro]);

  function cambiarPagina(numero) {
    setPaginaActual(numero);
  }

  function irALogin() {
    setMostrarMenuLogin(false);
    navigate("/login");
  }

  function irARegistro() {
    setMostrarMenuLogin(false);
    navigate("/signup");
  }

  return (
    <div className='Contenedor'>
      <div className='Barra'>
        <img src='icons/Logo.jpeg' alt="Logo" />

        <div className='barraFiltros'>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className='inputFiltro'
          />

          <select
            value={razaFiltro}
            onChange={(e) => setRazaFiltro(e.target.value)}
            className='selectFiltro'
          >
            {opcionesFiltro.map((raza, index) => (
              <option key={index} value={raza}>
                {raza}
              </option>
            ))}
          </select>

          <button
            className='botonLimpiar'
            onClick={() => {
              setBusqueda("");
              setRazaFiltro("Todas");
            }}
          >
            Limpiar
          </button>
        </div>

        <div className="loginContainer">
          <button
            className="botonLogin"
            onClick={() => setMostrarMenuLogin(!mostrarMenuLogin)}
          >
            Login
          </button>

          {mostrarMenuLogin && (
            <div className="menuLogin">
              <button onClick={irALogin}>
                Iniciar sesión
              </button>

              <button onClick={irARegistro}>
                Crear cuenta
              </button>
            </div>
          )}
        </div>
      </div>

      <div className='Contenido'>
        <div className='Panel'>
          <div className='almacendeposts'>
            {mascotasPaginadas.map((mascota) => (
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
                      <div className='sinImagen'>No hay imagen</div>
                    )}
                  </button>
                </div>

                <div className='titulo'>
                  <h3>Nombre: {mascota.nombre}</h3>
                </div>

                <p>Raza: {mascota.raza || "No especificada"}</p>
                <p>Edad: {mascota.edad}</p>
                <p>Descripción: {mascota.descripcion}</p>

                {mostrarCuadro === mascota.id && (
                  <div className='overlay'>
                    <div className='modelo'>
                      <h2>Información Adicional</h2>
                      <p>Nombre: {mascota.nombre}</p>
                      <p>Raza: {mascota.raza || "No especificada"}</p>
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
            ))}
          </div>

          <div className='paginacion'>
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index + 1}
                className={paginaActual === index + 1 ? "pagina activa" : "pagina"}
                onClick={() => cambiarPagina(index + 1)}
              >
                {index + 1}
              </button>
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