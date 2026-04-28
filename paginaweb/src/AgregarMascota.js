import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AgregarMascota.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function CambiarVistaMapa({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

function ClickEnMapa({
  setLat,
  setLng,
  setDireccionSeleccionada,
  setPosicionMarcador,
  setCargandoDireccion
}) {
  useMapEvents({
    async click(e) {
      const nuevaLat = e.latlng.lat;
      const nuevaLng = e.latlng.lng;

      setCargandoDireccion(true);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nuevaLat}&lon=${nuevaLng}`,
          {
            headers: {
              Accept: "application/json"
            }
          }
        );

        const data = await response.json();

        const direccion =
          data.display_name ||
          `Ubicación aproximada: ${nuevaLat.toFixed(6)}, ${nuevaLng.toFixed(6)}`;

        const confirmar = window.confirm(
          `¿Quieres usar esta dirección?\n\n${direccion}`
        );

        if (confirmar) {
          setLat(String(nuevaLat));
          setLng(String(nuevaLng));
          setDireccionSeleccionada(direccion);
          setPosicionMarcador([nuevaLat, nuevaLng]);
        }
      } catch (error) {
        const direccionRespaldo = `Ubicación aproximada: ${nuevaLat.toFixed(6)}, ${nuevaLng.toFixed(6)}`;

        const confirmar = window.confirm(
          `No se encontró una dirección exacta.\n\n¿Quieres usar esta ubicación aproximada?\n\n${direccionRespaldo}`
        );

        if (confirmar) {
          setLat(String(nuevaLat));
          setLng(String(nuevaLng));
          setDireccionSeleccionada(direccionRespaldo);
          setPosicionMarcador([nuevaLat, nuevaLng]);
        }
      } finally {
        setCargandoDireccion(false);
      }
    }
  });

  return null;
}

const razasPerro = [
  "Labrador Retriever",
  "Pastor Alemán",
  "Golden Retriever",
  "Bulldog Francés",
  "Bulldog Inglés",
  "Poodle",
  "Chihuahua",
  "Beagle",
  "Rottweiler",
  "Yorkshire Terrier",
  "Boxer",
  "Dachshund",
  "Siberian Husky",
  "Doberman",
  "Shih Tzu",
  "Pug",
  "Border Collie",
  "Cocker Spaniel",
  "Maltés",
  "Boston Terrier",
  "Akita",
  "Pomerania",
  "Pitbull",
  "Gran Danés",
  "Samoyedo",
  "Basset Hound",
  "Weimaraner",
  "Bull Terrier",
  "Galgo",
  "Shar Pei",
  "American Bully",
  "Cane Corso",
  "Criollo / Mestizo"
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

function AgregarMascota() {
  const [tipo, setTipo] = useState("");
  const [idTipo, setIdTipo] = useState("");
  const [otroAnimal, setOtroAnimal] = useState("");
  const [tamano, setTamano] = useState("");

  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");

  const [ubicacionActual, setUbicacionActual] = useState([20.6736, -103.344]);
  const [posicionMarcador, setPosicionMarcador] = useState(null);
  const [direccionActual, setDireccionActual] = useState("Buscando tu ubicación...");
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [cargandoDireccion, setCargandoDireccion] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setDireccionActual("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latActual = position.coords.latitude;
        const lngActual = position.coords.longitude;

        setUbicacionActual([latActual, lngActual]);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latActual}&lon=${lngActual}`,
            {
              headers: {
                Accept: "application/json"
              }
            }
          );

          const data = await response.json();

          const direccion =
            data.display_name ||
            `Ubicación aproximada: ${latActual.toFixed(6)}, ${lngActual.toFixed(6)}`;

          setDireccionActual(direccion);
        } catch (error) {
          setDireccionActual(
            `No se pudo encontrar tu dirección exacta. Ubicación aproximada: ${latActual.toFixed(6)}, ${lngActual.toFixed(6)}`
          );
        }
      },
      () => {
        setDireccionActual("No se pudo obtener tu ubicación actual");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  function cambiarTipo(valor) {
    setTipo(valor);
    setRaza("");
    setTamano("");
    setOtroAnimal("");

    if (valor === "Perro") setIdTipo("1");
    else if (valor === "Gato") setIdTipo("2");
    else if (valor === "Otro") setIdTipo("3");
    else setIdTipo("");
  }

  function handleImagen(e) {
    const archivo = e.target.files[0];

    if (!archivo) {
      setImagen(null);
      setPreview("");
      return;
    }

    setImagen(archivo);
    setPreview(URL.createObjectURL(archivo));
  }

  async function addMascota() {
    try {
      if (!tipo || !nombre || !edad || !lat || !lng || !descripcion) {
        alert("Llena todos los campos y selecciona una ubicación en el mapa");
        return;
      }

      if (tipo !== "Otro" && !raza) {
        alert("Selecciona una raza");
        return;
      }

      if (tipo === "Perro" && !tamano) {
        alert("Selecciona el tamaño del perro");
        return;
      }

      if (tipo === "Otro" && !otroAnimal) {
        alert("Escribe qué animal es");
        return;
      }

      const usuario = JSON.parse(localStorage.getItem("usuario"));

      if (!usuario) {
        alert("Necesitas iniciar sesión");
        return;
      }

      const formData = new FormData();

      formData.append("nombre", nombre);
      formData.append("raza", tipo === "Otro" ? "" : raza);
      formData.append("edad", edad);
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("descripcion", descripcion);
      formData.append("direccion", direccionSeleccionada);
      formData.append("id_user", usuario.id_user);

      formData.append("id_tipo", idTipo);
      formData.append("tipo", tipo);
      formData.append("tamano", tipo === "Perro" ? tamano : "");
      formData.append("otro_animal", tipo === "Otro" ? otroAnimal : "");

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch("http://localhost:3001/api/mascotas", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log("Respuesta servidor:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Error al guardar mascota");
      }

      alert("Mascota guardada correctamente");

      setTipo("");
      setIdTipo("");
      setOtroAnimal("");
      setTamano("");
      setNombre("");
      setRaza("");
      setEdad("");
      setLat("");
      setLng("");
      setDescripcion("");
      setImagen(null);
      setPreview("");
      setDireccionSeleccionada("");
      setPosicionMarcador(null);
    } catch (error) {
      console.error("Error al mandar datos:", error);
      alert("No se pudo guardar la mascota");
    }
  }

  return (
    <div className="agregar-mascota-contenedor">
      <div className="agregar-mascota-card">
        <h1 className="agregar-mascota-titulo">Agregar Mascota</h1>

        <div className="agregar-mascota-formulario">
          <div className="selector-tipo-contenedor">
            <label className="selector-tipo-titulo">Primero selecciona el animal</label>

            <div className="selector-tipo-opciones">
              <button
                type="button"
                className={tipo === "Perro" ? "tipo-card activo" : "tipo-card"}
                onClick={() => cambiarTipo("Perro")}
              >
                🐶
                <span>Perro</span>
              </button>

              <button
                type="button"
                className={tipo === "Gato" ? "tipo-card activo" : "tipo-card"}
                onClick={() => cambiarTipo("Gato")}
              >
                🐱
                <span>Gato</span>
              </button>

              <button
                type="button"
                className={tipo === "Otro" ? "tipo-card activo" : "tipo-card"}
                onClick={() => cambiarTipo("Otro")}
              >
                🐾
                <span>Otro</span>
              </button>
            </div>
          </div>

          {tipo !== "" && (
            <>
              {tipo === "Otro" && (
                <div className="agregar-mascota-grupo">
                  <label>¿Qué animal es?</label>
                  <input
                    type="text"
                    value={otroAnimal}
                    onChange={(e) => setOtroAnimal(e.target.value)}
                    placeholder="Ej. conejo, ave, hámster"
                  />
                </div>
              )}

              <div className="agregar-mascota-grupo">
                <label>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {tipo !== "Otro" && (
                <div className="agregar-mascota-grupo">
                  <label>Raza</label>
                  <select value={raza} onChange={(e) => setRaza(e.target.value)}>
                    <option value="">Selecciona una raza</option>
                    {(tipo === "Perro" ? razasPerro : razasGato).map((razaItem, index) => (
                      <option key={index} value={razaItem}>
                        {razaItem}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {tipo === "Perro" && (
                <div className="agregar-mascota-grupo">
                  <label>Tamaño</label>
                  <select value={tamano} onChange={(e) => setTamano(e.target.value)}>
                    <option value="">Selecciona tamaño</option>
                    {tamanosPerro.map((tamanoItem, index) => (
                      <option key={index} value={tamanoItem}>
                        {tamanoItem}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="agregar-mascota-grupo">
                <label>Edad</label>
                <input
                  type="number"
                  min="0"
                  value={edad}
                  onChange={(e) => {
                    if (Number(e.target.value) < 0) return;
                    setEdad(e.target.value);
                  }}
                />
              </div>

              <div className="agregar-mascota-grupo">
                <label>Descripción</label>
                <input
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="agregar-mascota-grupo">
                <label>Tu ubicación actual</label>
                <div className="direccion-box">{direccionActual}</div>
              </div>

              <div className="agregar-mascota-grupo">
                <label>Selecciona la ubicación en el mapa</label>
                <div className="mapa-contenedor">
                  <MapContainer
                    center={ubicacionActual}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <CambiarVistaMapa center={ubicacionActual} />

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ClickEnMapa
                      setLat={setLat}
                      setLng={setLng}
                      setDireccionSeleccionada={setDireccionSeleccionada}
                      setPosicionMarcador={setPosicionMarcador}
                      setCargandoDireccion={setCargandoDireccion}
                    />

                    {posicionMarcador && (
                      <Marker position={posicionMarcador}>
                        <Popup>{direccionSeleccionada}</Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
              </div>

              {cargandoDireccion && (
                <div className="mensaje-mapa">Buscando dirección...</div>
              )}

              <div className="agregar-mascota-grupo">
                <label>Dirección seleccionada</label>
                <div className="direccion-box">
                  {direccionSeleccionada || "Haz click en el mapa para elegir una ubicación"}
                </div>
              </div>

              <div className="agregar-mascota-grupo">
                <label>Imagen</label>
                <input
                  className="agregar-mascota-archivo"
                  type="file"
                  accept="image/*"
                  onChange={handleImagen}
                />
              </div>

              {preview && (
                <div className="agregar-mascota-preview">
                  <p>Vista previa</p>
                  <img src={preview} alt="Vista previa" />
                </div>
              )}

              <button className="agregar-mascota-boton" onClick={addMascota}>
                Mandar Datos
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgregarMascota;