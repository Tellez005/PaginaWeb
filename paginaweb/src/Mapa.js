import "./App.css";
import Map from "./components/map/Map.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Mapa.css";

function Mapa() {
  const [kmFiltro, setKmFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [razaFiltro, setRazaFiltro] = useState("Todas");
  const [tamanoFiltro, setTamanoFiltro] = useState("Todos");
  const [otroAnimalFiltro, setOtroAnimalFiltro] = useState("");

  const [miUbicacion, setMiUbicacion] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [mostrarCuadro, setMostrarCuadro] = useState(null);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarMenuLogin, setMostrarMenuLogin] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const navigate = useNavigate();
  const postsPorPagina = 15;

  const razasPerro = [
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
    "Kangal",
    "Otra"
  ];

  const razasGato = [
    "Mestizo",
    "Siamés",
    "Persa",
    "Maine Coon",
    "Bengalí",
    "Sphynx",
    "Ragdoll",
    "Azul Ruso",
    "British Shorthair",
    "Angora",
    "Otra"
  ];

  const tamanosPerro = [
    "Enano",
    "Chico",
    "Mediano",
    "Grande",
    "Enorme"
  ];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "UBICACIÓN DE LA APP:",
            position.coords.latitude,
            position.coords.longitude
          );

          setMiUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Error al obtener ubicación:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

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

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      setUsuarioLogueado(JSON.parse(usuarioGuardado));
    }
  }, []);

  function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function obtenerTipoMascota(mascota) {
    if (mascota.id_tipo === 1 || mascota.id_tipo === "1") return "Perro";
    if (mascota.id_tipo === 2 || mascota.id_tipo === "2") return "Gato";
    if (mascota.id_tipo === 3 || mascota.id_tipo === "3") return "Otro";
    return "";
  }

  const mascotasFiltradas = mascotas.filter((mascota) => {
    const tipoMascota = obtenerTipoMascota(mascota);

    const tipoCoincide =
      tipoFiltro === "Todos" || tipoMascota === tipoFiltro;

    const razaCoincide =
      razaFiltro === "Todas" ||
      mascota.raza?.toLowerCase() === razaFiltro.toLowerCase();

    const tamanoCoincide =
      tamanoFiltro === "Todos" ||
      mascota.tamano?.toLowerCase() === tamanoFiltro.toLowerCase();

    const otroAnimalCoincide =
      otroAnimalFiltro === "" ||
      mascota.otro_animal
        ?.toLowerCase()
        .includes(otroAnimalFiltro.toLowerCase());

    let kmCoincide = true;

    if (kmFiltro !== "" && miUbicacion) {
      const distancia = calcularDistanciaKm(
        miUbicacion.lat,
        miUbicacion.lng,
        Number(mascota.lat),
        Number(mascota.lng)
      );

      kmCoincide = distancia <= Number(kmFiltro);
    }

    if (tipoFiltro === "Perro") {
      return tipoCoincide && razaCoincide && tamanoCoincide && kmCoincide;
    }

    if (tipoFiltro === "Gato") {
      return tipoCoincide && razaCoincide && kmCoincide;
    }

    if (tipoFiltro === "Otro") {
      return tipoCoincide && otroAnimalCoincide && kmCoincide;
    }

    return tipoCoincide && kmCoincide;
  });

  const totalPaginas = Math.ceil(mascotasFiltradas.length / postsPorPagina);
  const indiceInicial = (paginaActual - 1) * postsPorPagina;
  const indiceFinal = indiceInicial + postsPorPagina;
  const mascotasPaginadas = mascotasFiltradas.slice(indiceInicial, indiceFinal);

  useEffect(() => {
    setPaginaActual(1);
  }, [tipoFiltro, razaFiltro, tamanoFiltro, otroAnimalFiltro, kmFiltro]);

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

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(null);
    setMostrarMenuLogin(false);
  }

  function irACrearPost() {
    navigate("/agregarMascota");
  }

  function limpiarFiltros() {
    setTipoFiltro("Todos");
    setRazaFiltro("Todas");
    setTamanoFiltro("Todos");
    setOtroAnimalFiltro("");
    setKmFiltro("");
  }

  return (
    <div className="Contenedor">
      <div className="Barra">
        <img src="icons/Logo.jpeg" alt="Logo" />

        <div className="barraFiltros">
          <select
            value={tipoFiltro}
            onChange={(e) => {
              setTipoFiltro(e.target.value);
              setRazaFiltro("Todas");
              setTamanoFiltro("Todos");
              setOtroAnimalFiltro("");
            }}
            className="selectFiltro"
          >
            <option value="Todos">Todos</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>

          <input
            type="number"
            min="0"
            placeholder="Km"
            value={kmFiltro}
            onChange={(e) => {
              if (Number(e.target.value) < 0) return;
              setKmFiltro(e.target.value);
            }}
            className="inputFiltro"
          />

          <button className="botonLimpiar" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>

        <div className="loginContainer">
          {usuarioLogueado ? (
            <div className="usuarioLogueado">
              <span className="textoUsuario">
                Ya iniciaste sesión
                {usuarioLogueado.nombre ? `: ${usuarioLogueado.nombre}` : ""}
              </span>

              <button className="botonCerrarSesion" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <button
                className="botonLogin"
                onClick={() => setMostrarMenuLogin(!mostrarMenuLogin)}
              >
                Login
              </button>

              {mostrarMenuLogin && (
                <div className="menuLogin">
                  <button onClick={irALogin}>Iniciar sesión</button>
                  <button onClick={irARegistro}>Crear cuenta</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {tipoFiltro !== "Todos" && (
        <div className="barraSecundaria">
          {tipoFiltro === "Perro" && (
            <>
              <select
                value={razaFiltro}
                onChange={(e) => setRazaFiltro(e.target.value)}
                className="selectFiltro"
              >
                <option value="Todas">Todas las razas</option>
                {razasPerro.map((raza, index) => (
                  <option key={index} value={raza}>
                    {raza}
                  </option>
                ))}
              </select>

              <select
                value={tamanoFiltro}
                onChange={(e) => setTamanoFiltro(e.target.value)}
                className="selectFiltro"
              >
                <option value="Todos">Todos los tamaños</option>
                {tamanosPerro.map((tamano, index) => (
                  <option key={index} value={tamano}>
                    {tamano}
                  </option>
                ))}
              </select>
            </>
          )}

          {tipoFiltro === "Gato" && (
            <select
              value={razaFiltro}
              onChange={(e) => setRazaFiltro(e.target.value)}
              className="selectFiltro"
            >
              <option value="Todas">Todas las razas</option>
              {razasGato.map((raza, index) => (
                <option key={index} value={raza}>
                  {raza}
                </option>
              ))}
            </select>
          )}

          {tipoFiltro === "Otro" && (
            <input
              type="text"
              placeholder="Buscar animal: conejo, ave..."
              value={otroAnimalFiltro}
              onChange={(e) => setOtroAnimalFiltro(e.target.value)}
              className="inputFiltro inputOtroAnimal"
            />
          )}
        </div>
      )}

      <div className="Contenido">
        <div className="Panel">
          <div className="almacendeposts">
            {mascotasPaginadas.map((mascota) => (
              <div className="posts" key={mascota.id_mascota || mascota.id}>
                <div className="imagenMascota">
                  <button
                    className="botonanimal"
                    onClick={() => {
                      setMostrarCuadro(
                        mostrarCuadro === mascota.id_mascota
                          ? null
                          : mascota.id_mascota
                      );
                      setMascotaSeleccionada(mascota);
                    }}
                  >
                    {mascota.imagen ? (
                      <img
                        src={`http://localhost:3001${mascota.imagen}`}
                        alt={mascota.nombre}
                      />
                    ) : (
                      <div className="sinImagen">No hay imagen</div>
                    )}
                  </button>
                </div>

                <div className="titulo">
                  <h3>Nombre: {mascota.nombre}</h3>
                </div>

                <p>Tipo: {obtenerTipoMascota(mascota) || "No especificado"}</p>

                {obtenerTipoMascota(mascota) === "Otro" ? (
                  <p>Animal: {mascota.otro_animal || "No especificado"}</p>
                ) : (
                  <p>Raza: {mascota.raza || "No especificada"}</p>
                )}

                {obtenerTipoMascota(mascota) === "Perro" && (
                  <p>Tamaño: {mascota.tamano || "No especificado"}</p>
                )}

                <p>Edad: {mascota.edad}</p>
                <p>Descripción: {mascota.descripcion}</p>

                {mostrarCuadro === mascota.id_mascota && (
                  <div className="overlay">
                    <div className="modelo">
                      <h2>Información Adicional</h2>
                      <p>Nombre: {mascota.nombre}</p>
                      <p>Tipo: {obtenerTipoMascota(mascota)}</p>

                      {obtenerTipoMascota(mascota) === "Otro" ? (
                        <p>Animal: {mascota.otro_animal}</p>
                      ) : (
                        <p>Raza: {mascota.raza || "No especificada"}</p>
                      )}

                      {obtenerTipoMascota(mascota) === "Perro" && (
                        <p>Tamaño: {mascota.tamano || "No especificado"}</p>
                      )}

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

          <div className="paginacion">
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index + 1}
                className={
                  paginaActual === index + 1 ? "pagina activa" : "pagina"
                }
                onClick={() => cambiarPagina(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="App">
          <Map
            mascotaSeleccionada={mascotaSeleccionada}
            mascotas={mascotasFiltradas}
          />
        </div>
      </div>

      {usuarioLogueado && (
        <button className="botonCrearPostFlotante" onClick={irACrearPost}>
          + Crear post
        </button>
      )}
    </div>
  );
}

export default Mapa;