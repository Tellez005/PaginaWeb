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

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log("Respuesta reverse geocoding:", data);

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
        console.error("Error al obtener dirección del mapa:", error);

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
  "Bóxer Alemán",
  "Samoyedo",
  "Basset Hound",
  "Weimaraner",
  "Pekinés",
  "Mastín",
  "Mastín Napolitano",
  "San Bernardo",
  "Bull Terrier",
  "Fox Terrier",
  "Jack Russell Terrier",
  "Caniche",
  "Galgo",
  "Whippet",
  "Shar Pei",
  "Airedale Terrier",
  "American Bully",
  "Cane Corso",
  "Setter Irlandés",
  "Terranova",
  "Papillón",
  "Lhasa Apso",
  "Havanese",
  "Alaskan Malamute",
  "Australian Shepherd",
  "Criollo / Mestizo"
];

function AgregarMascota() {
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

        console.log("Ubicación actual:", latActual, lngActual);

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

          if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
          }

          const data = await response.json();
          console.log("Dirección actual:", data);

          const direccion =
            data.display_name ||
            `Ubicación aproximada: ${latActual.toFixed(6)}, ${lngActual.toFixed(6)}`;

          setDireccionActual(direccion);
        } catch (error) {
          console.error("Error obteniendo dirección actual:", error);
          setDireccionActual(
            `No se pudo encontrar tu dirección exacta. Ubicación aproximada: ${latActual.toFixed(6)}, ${lngActual.toFixed(6)}`
          );
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error);
        setDireccionActual("No se pudo obtener tu ubicación actual");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

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
      if (!nombre || !raza || !edad || !lat || !lng || !descripcion) {
        alert("Llena todos los campos y selecciona una ubicación en el mapa");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("raza", raza);
      formData.append("edad", edad);
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("descripcion", descripcion);
      formData.append("direccion", direccionSeleccionada);

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
          <div className="agregar-mascota-grupo">
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="agregar-mascota-grupo">
            <label>Raza</label>
            <select
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            >
              <option value="">Selecciona una raza</option>
              {razasPerro.map((razaItem, index) => (
                <option key={index} value={razaItem}>
                  {razaItem}
                </option>
              ))}
            </select>
          </div>

          <div className="agregar-mascota-grupo">
            <label>Edad</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
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
            <div className="direccion-box">
              {direccionActual}
            </div>
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
            <div className="mensaje-mapa">
              Buscando dirección...
            </div>
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
        </div>
      </div>
    </div>
  );
}

export default AgregarMascota;