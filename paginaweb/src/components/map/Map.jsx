import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const dogIcon = L.icon({
  iconUrl: "/icons/Perro.png",
  iconSize: [85, 110],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

const catIcon = L.icon({
  iconUrl: "/icons/gatos.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

const otherIcon = L.icon({
  iconUrl: "/icons/Desaparecidos.png",
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

function obtenerIcono(tipo) {
  if (!tipo) return dogIcon;

  const tipoLimpio = tipo.toLowerCase().trim();

  if (
    tipoLimpio.includes("perro") ||
    tipoLimpio.includes("dog") ||
    tipoLimpio.includes("canino")
  ) {
    return dogIcon;
  }

  if (
    tipoLimpio.includes("gato") ||
    tipoLimpio.includes("cat") ||
    tipoLimpio.includes("felino")
  ) {
    return catIcon;
  }

  return otherIcon;
}

function MoverMapa({ mascotaSeleccionada }) {
  const map = useMap();

  useEffect(() => {
    if (
      mascotaSeleccionada &&
      mascotaSeleccionada.lat !== undefined &&
      mascotaSeleccionada.lng !== undefined
    ) {
      const lat = Number(mascotaSeleccionada.lat);
      const lng = Number(mascotaSeleccionada.lng);

      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView([lat, lng], 16);
      }
    }
  }, [mascotaSeleccionada, map]);

  return null;
}

function Map({ mascotaSeleccionada }) {
  const [geodata, setGeoData] = useState(null);
  const [mascotasMapa, setMascotasMapa] = useState([]);
  const mapRef = useRef(null);

  const position = [20.73822228680415, -103.4472214186193];

  useEffect(() => {
    fetch("/data/guadalajara_sublocs.geojson")
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load GeoJSON", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/mascotas")
      .then((res) => res.json())
      .then((data) => {
        const mascotasValidas = data.filter((mascota) => {
          const lat = Number(mascota.lat);
          const lng = Number(mascota.lng);

          return !isNaN(lat) && !isNaN(lng);
        });

        setMascotasMapa(mascotasValidas);
      })
      .catch((err) => {
        console.log("Error al obtener mascotas para el mapa:", err);
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        ref={mapRef}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MoverMapa mascotaSeleccionada={mascotaSeleccionada} />

        {mascotasMapa.map((mascota) => {
          const lat = Number(mascota.lat);
          const lng = Number(mascota.lng);

          return (
            <Marker
              key={mascota.id}
              position={[lat, lng]}
              icon={obtenerIcono(mascota.tipo || mascota.animal || mascota.especie)}
            >
              <Popup>
                <div>
                  <h3>{mascota.nombre}</h3>
                  <p><strong>Raza:</strong> {mascota.raza || "No especificada"}</p>
                  <p><strong>Edad:</strong> {mascota.edad || "No especificada"}</p>
                  <p><strong>Descripción:</strong> {mascota.descripcion || "Sin descripción"}</p>

                  {mascota.imagen && (
                    <img
                      src={`http://localhost:3001${mascota.imagen}`}
                      alt={mascota.nombre}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginTop: "8px"
                      }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {geodata && <GeoJSON data={geodata} />}
      </MapContainer>
    </div>
  );
}

export default Map;