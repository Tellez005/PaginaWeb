//A
import "./App.css";
import Map from "./components/map/Map.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Mapa.css";

function Mapa() {
  const [kmFiltro, setKmFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
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

  const [postEditando, setPostEditando] = useState(null);
  const [formEditar, setFormEditar] = useState({
    nombre: "",
    raza: "",
    edad: "",
    descripcion: "",
    tamano: "",
    otro_animal: "",
    estado: "perdido"
  });

  const navigate = useNavigate();
  const postsPorPagina = 15;

  const razasPerro = [
    "Mestizo", "Chihuahua", "Schnauzer", "Golden Retriever",
    "Labrador Retriever", "Pug", "Yorkshire Terrier", "Poodle",
    "Pastor Alemán", "Bulldog Francés", "Bulldog Inglés", "Pitbull",
    "Husky Siberiano", "Beagle", "Rottweiler", "Shih Tzu",
    "Maltés", "Cocker Spaniel", "Doberman", "Dálmata", "Boxer",
    "Border Collie", "Akita Inu", "Samoyedo", "Weimaraner",
    "Basset Hound", "Gran Danés", "Chow Chow", "Jack Russell Terrier",
    "Bull Terrier", "Pomerania", "Shar Pei", "Setter Irlandés",
    "Galgo", "Terrier Escocés", "Fox Terrier", "Boston Terrier",
    "American Staffordshire Terrier", "Cane Corso", "Mastín Napolitano",
    "Xoloitzcuintle", "Perro sin pelo peruano", "Chihuahua de pelo largo",
    "Pastor Belga", "Vizsla", "Pointer Inglés", "Airedale Terrier",
    "Collie", "Whippet", "Kangal", "Otra"
  ];

  const razasGato = [
    "Mestizo", "Siamés", "Persa", "Maine Coon", "Bengalí",
    "Sphynx", "Ragdoll", "Azul Ruso", "British Shorthair",
    "Angora", "Otra"
  ];

  const tamanosPerro = ["Enano", "Chico", "Mediano", "Grande", "Enorme"];

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMiUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error al obtener ubicación:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  }, []);

  useEffect(() => {
    cargarMascotas();
  }, []);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (usuarioGuardado) {
      setUsuarioLogueado(JSON.parse(usuarioGuardado));
    }
  }, []);

  function cargarMascotas() {
    fetch("http://localhost:3001/mascotas")
      .then((res) => res.json())
      .then((data) => {
        setMascotas(data);
      })
      .catch((error) => {
        console.log("Error al obtener mascotas:", error);
      });
  }

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

  function obtenerEstado(mascota) {
    if (!mascota.estado) return "perdido";
    return mascota.estado.toLowerCase();
  }

  function puedeEditarPost(mascota) {
    if (!usuarioLogueado) return false;
    return Number(usuarioLogueado.id_user) === Number(mascota.id_user);
  }

  function cambiarEstadoMascota(mascota, nuevoEstado) {
    if (!usuarioLogueado) return alert("Debes iniciar sesión");
    if (!puedeEditarPost(mascota)) return alert("Solo el creador puede cambiar este post");

    fetch(`http://localhost:3001/mascotas/${mascota.id_mascota}/estado`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estado: nuevoEstado,
        id_user: usuarioLogueado.id_user
      })
    })
      .then((res) => res.json())
      .then(() => {
        setMascotas((actuales) =>
          actuales.map((m) =>
            m.id_mascota === mascota.id_mascota
              ? { ...m, estado: nuevoEstado }
              : m
          )
        );
      })
      .catch((error) => console.log("Error al actualizar estado:", error));
  }

  function abrirEditar(mascota) {
    setPostEditando(mascota);

    setFormEditar({
      nombre: mascota.nombre || "",
      raza: mascota.raza || "",
      edad: mascota.edad || "",
      descripcion: mascota.descripcion || "",
      tamano: mascota.tamano || "",
      otro_animal: mascota.otro_animal || "",
      estado: obtenerEstado(mascota)
    });
  }

  function guardarCambiosPost() {
    if (!postEditando || !usuarioLogueado) return;

    fetch(`http://localhost:3001/mascotas/${postEditando.id_mascota}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formEditar,
        id_user: usuarioLogueado.id_user
      })
    })
      .then((res) => res.json())
      .then(() => {
        setMascotas((actuales) =>
          actuales.map((m) =>
            m.id_mascota === postEditando.id_mascota
              ? { ...m, ...formEditar }
              : m
          )
        );

        setPostEditando(null);
        setMostrarCuadro(null);
      })
      .catch((error) => console.log("Error al editar:", error));
  }

  function eliminarPost(mascota) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este post?");
    if (!confirmar) return;

    fetch(`http://localhost:3001/mascotas/${mascota.id_mascota}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_user: usuarioLogueado.id_user
      })
    })
      .then((res) => res.json())
      .then(() => {
        setMascotas((actuales) =>
          actuales.filter((m) => m.id_mascota !== mascota.id_mascota)
        );

        setPostEditando(null);
        setMostrarCuadro(null);
      })
      .catch((error) => console.log("Error al eliminar:", error));
  }

  const mascotasFiltradas = mascotas.filter((mascota) => {
    const tipoMascota = obtenerTipoMascota(mascota);
    const estadoMascota = obtenerEstado(mascota);

    const tipoCoincide = tipoFiltro === "Todos" || tipoMascota === tipoFiltro;
    const estadoCoincide = estadoFiltro === "Todos" || estadoMascota === estadoFiltro;

    const razaCoincide =
      razaFiltro === "Todas" ||
      mascota.raza?.toLowerCase() === razaFiltro.toLowerCase();

    const tamanoCoincide =
      tamanoFiltro === "Todos" ||
      mascota.tamano?.toLowerCase() === tamanoFiltro.toLowerCase();

    const otroAnimalCoincide =
      otroAnimalFiltro === "" ||
      mascota.otro_animal?.toLowerCase().includes(otroAnimalFiltro.toLowerCase());

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
      return tipoCoincide && estadoCoincide && razaCoincide && tamanoCoincide && kmCoincide;
    }

    if (tipoFiltro === "Gato") {
      return tipoCoincide && estadoCoincide && razaCoincide && kmCoincide;
    }

    if (tipoFiltro === "Otro") {
      return tipoCoincide && estadoCoincide && otroAnimalCoincide && kmCoincide;
    }

    return tipoCoincide && estadoCoincide && kmCoincide;
  });

  const totalPaginas = Math.ceil(mascotasFiltradas.length / postsPorPagina);
  const indiceInicial = (paginaActual - 1) * postsPorPagina;
  const mascotasPaginadas = mascotasFiltradas.slice(indiceInicial, indiceInicial + postsPorPagina);

  useEffect(() => {
    setPaginaActual(1);
  }, [tipoFiltro, estadoFiltro, razaFiltro, tamanoFiltro, otroAnimalFiltro, kmFiltro]);

  function limpiarFiltros() {
    setTipoFiltro("Todos");
    setEstadoFiltro("Todos");
    setRazaFiltro("Todas");
    setTamanoFiltro("Todos");
    setOtroAnimalFiltro("");
    setKmFiltro("");
  }

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    setUsuarioLogueado(null);
    setMostrarMenuLogin(false);
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
            <option value="Todos">Todos los animales</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Otro">Otro</option>
          </select>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
            className="selectFiltro"
          >
            <option value="Todos">Todos los estados</option>
            <option value="perdido">Perdidos</option>
            <option value="encontrado">Encontrados</option>
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
              <span className="textoUsuario">Ya iniciaste sesión</span>

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
                  <button onClick={() => navigate("/login")}>Iniciar sesión</button>
                  <button onClick={() => navigate("/signup")}>Crear cuenta</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {(tipoFiltro !== "Todos" || estadoFiltro !== "Todos") && (
        <div className="barraSecundaria">
          {tipoFiltro === "Perro" && (
            <>
              <select value={razaFiltro} onChange={(e) => setRazaFiltro(e.target.value)} className="selectFiltro">
                <option value="Todas">Todas las razas</option>
                {razasPerro.map((raza, index) => (
                  <option key={index} value={raza}>{raza}</option>
                ))}
              </select>

              <select value={tamanoFiltro} onChange={(e) => setTamanoFiltro(e.target.value)} className="selectFiltro">
                <option value="Todos">Todos los tamaños</option>
                {tamanosPerro.map((tamano, index) => (
                  <option key={index} value={tamano}>{tamano}</option>
                ))}
              </select>
            </>
          )}

          {tipoFiltro === "Gato" && (
            <select value={razaFiltro} onChange={(e) => setRazaFiltro(e.target.value)} className="selectFiltro">
              <option value="Todas">Todas las razas</option>
              {razasGato.map((raza, index) => (
                <option key={index} value={raza}>{raza}</option>
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
            {mascotasPaginadas.map((mascota) => {
              const estadoMascota = obtenerEstado(mascota);
              const tipoMascota = obtenerTipoMascota(mascota);

              return (
                <div
                  className={estadoMascota === "encontrado" ? "posts postEncontrado" : "posts postPerdido"}
                  key={mascota.id_mascota}
                >
                  <div className="estadoPost">
                    <span className={estadoMascota === "encontrado" ? "etiquetaEstado encontrado" : "etiquetaEstado perdido"}>
                      {estadoMascota === "encontrado" ? "Encontrado" : "Perdido"}
                    </span>

                    <div className="accionesPost">
                      {puedeEditarPost(mascota) && (
                        <>
                          <button className="botonEditarPost" onClick={() => abrirEditar(mascota)}>
                            ⚙️
                          </button>

                          <select
                            className="selectEstadoPost"
                            value={estadoMascota}
                            onChange={(e) => cambiarEstadoMascota(mascota, e.target.value)}
                          >
                            <option value="perdido">Perdido</option>
                            <option value="encontrado">Encontrado</option>
                          </select>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="imagenMascota">
                    <button
                      className="botonanimal"
                      onClick={() => {
                        setMostrarCuadro(mostrarCuadro === mascota.id_mascota ? null : mascota.id_mascota);
                        setMascotaSeleccionada(mascota);
                      }}
                    >
                      {mascota.imagen ? (
                        <img src={`http://localhost:3001${mascota.imagen}`} alt={mascota.nombre} />
                      ) : (
                        <div className="sinImagen">No hay imagen</div>
                      )}
                    </button>
                  </div>

                  <div className="titulo">
                    <h3>Nombre: {mascota.nombre}</h3>
                  </div>

                  <p>Tipo: {tipoMascota || "No especificado"}</p>

                  {tipoMascota === "Otro" ? (
                    <p>Animal: {mascota.otro_animal || "No especificado"}</p>
                  ) : (
                    <p>Raza: {mascota.raza || "No especificada"}</p>
                  )}

                  {tipoMascota === "Perro" && (
                    <p>Tamaño: {mascota.tamano || "No especificado"}</p>
                  )}

                  <p>Edad: {mascota.edad || "No especificada"}</p>
                  <p>Descripción: {mascota.descripcion || "Sin descripción"}</p>

                  {mostrarCuadro === mascota.id_mascota && (
                    <div className="overlay">
                      <div className={estadoMascota === "encontrado" ? "modelo modeloEncontrado" : "modelo modeloPerdido"}>
                        <h2>Información Adicional</h2>

                        <span className={estadoMascota === "encontrado" ? "etiquetaEstado encontrado" : "etiquetaEstado perdido"}>
                          {estadoMascota === "encontrado" ? "Encontrado" : "Perdido"}
                        </span>

                        <p>Nombre: {mascota.nombre}</p>
                        <p>Tipo: {tipoMascota}</p>

                        {tipoMascota === "Otro" ? (
                          <p>Animal: {mascota.otro_animal || "No especificado"}</p>
                        ) : (
                          <p>Raza: {mascota.raza || "No especificada"}</p>
                        )}

                        {tipoMascota === "Perro" && (
                          <p>Tamaño: {mascota.tamano || "No especificado"}</p>
                        )}

                        <p>Edad: {mascota.edad || "No especificada"}</p>
                        <p>Descripción: {mascota.descripcion || "Sin descripción"}</p>

                        {mascota.imagen && (
                          <img src={`http://localhost:3001${mascota.imagen}`} alt={mascota.nombre} />
                        )}

                        <button onClick={() => setMostrarCuadro(null)}>Cerrar</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="paginacion">
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index + 1}
                className={paginaActual === index + 1 ? "pagina activa" : "pagina"}
                onClick={() => setPaginaActual(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="App">
          <Map mascotaSeleccionada={mascotaSeleccionada} mascotas={mascotasFiltradas} />
        </div>
      </div>

      {usuarioLogueado && (
        <button className="botonCrearPostFlotante" onClick={() => navigate("/agregarMascota")}>
          + Crear post
        </button>
      )}

      {postEditando && (
        <div className="overlay">
          <div className="modelo modeloEditar">
            <h2>Editar post</h2>

            <input className="inputEditar" placeholder="Nombre" value={formEditar.nombre} onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })} />
            <input className="inputEditar" placeholder="Raza" value={formEditar.raza} onChange={(e) => setFormEditar({ ...formEditar, raza: e.target.value })} />
            <input className="inputEditar" type="number" placeholder="Edad" value={formEditar.edad} onChange={(e) => setFormEditar({ ...formEditar, edad: e.target.value })} />
            <input className="inputEditar" placeholder="Tamaño" value={formEditar.tamano} onChange={(e) => setFormEditar({ ...formEditar, tamano: e.target.value })} />
            <input className="inputEditar" placeholder="Otro animal" value={formEditar.otro_animal} onChange={(e) => setFormEditar({ ...formEditar, otro_animal: e.target.value })} />

            <textarea className="textareaEditar" placeholder="Descripción" value={formEditar.descripcion} onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })} />

            <select className="inputEditar" value={formEditar.estado} onChange={(e) => setFormEditar({ ...formEditar, estado: e.target.value })}>
              <option value="perdido">Perdido</option>
              <option value="encontrado">Encontrado</option>
            </select>

            <div className="botonesEditar">
              <button onClick={guardarCambiosPost}>Guardar</button>
              <button className="botonEliminarPost" onClick={() => eliminarPost(postEditando)}>Eliminar</button>
              <button onClick={() => setPostEditando(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mapa;