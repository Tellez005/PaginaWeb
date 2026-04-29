import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const dogIcon = L.icon({
  iconUrl: "/icons/Perro.png",
  iconSize: [70, 90],
  iconAnchor: [35, 85],
  popupAnchor: [0, -80]
});

const catIcon = L.icon({
  iconUrl: "/icons/gatos.png",
  iconSize: [65, 85],
  iconAnchor: [32, 80],
  popupAnchor: [0, -75]
});

const otherIcon = L.icon({
  iconUrl: "/icons/Desaparecidos.png",
  iconSize: [55, 55],
  iconAnchor: [27, 50],
  popupAnchor: [0, -45]
});

const myLocationIcon = L.divIcon({
  className: "miUbicacionIcono",
  html: `<div class="puntoUbicacion"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function obtenerIcono(mascota) {
  if (mascota.id_tipo === 1 || mascota.id_tipo === "1") return dogIcon;
  if (mascota.id_tipo === 2 || mascota.id_tipo === "2") return catIcon;
  if (mascota.id_tipo === 3 || mascota.id_tipo === "3") return otherIcon;

  return otherIcon;
}

function obtenerTipoMascota(mascota) {
  if (mascota.id_tipo === 1 || mascota.id_tipo === "1") return "Perro";
  if (mascota.id_tipo === 2 || mascota.id_tipo === "2") return "Gato";
  if (mascota.id_tipo === 3 || mascota.id_tipo === "3") return "Otro";

  return "No especificado";
}

function obtenerEstado(mascota) {
  if (!mascota.estado) return "perdido";
  return mascota.estado.toLowerCase();
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

function Map({ mascotaSeleccionada, mascotas = [] }) {
  const mapRef = useRef(null);
  const position = [20.73822228680415, -103.4472214186193];
  const [miUbicacion, setMiUbicacion] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setMiUbicacion({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Error ubicación en tiempo real:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const mascotasValidas = mascotas.filter((mascota) => {
    const lat = Number(mascota.lat);
    const lng = Number(mascota.lng);

    return !isNaN(lat) && !isNaN(lng);
  });

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
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MoverMapa mascotaSeleccionada={mascotaSeleccionada} />

        {miUbicacion && (
          <Marker
            position={[miUbicacion.lat, miUbicacion.lng]}
            icon={myLocationIcon}
          >
            <Popup>Estás aquí</Popup>
          </Marker>
        )}

        {mascotasValidas.map((mascota) => {
          const lat = Number(mascota.lat);
          const lng = Number(mascota.lng);
          const tipoMascota = obtenerTipoMascota(mascota);
          const estadoMascota = obtenerEstado(mascota);

          return (
            <Marker
              key={mascota.id_mascota}
              position={[lat, lng]}
              icon={obtenerIcono(mascota)}
            >
              <Popup>
                <div style={{ width: "190px" }}>
                  <h3>{mascota.nombre}</h3>

                  <p>
                    <strong>Estado:</strong>{" "}
                    <span
                      style={{
                        color: estadoMascota === "encontrado" ? "green" : "red",
                        fontWeight: "bold"
                      }}
                    >
                      {estadoMascota === "encontrado" ? "Encontrado" : "Perdido"}
                    </span>
                  </p>

                  <p><strong>Tipo:</strong> {tipoMascota}</p>
                  {tipoMascota === "Otro" ? (
                    <p><strong>Animal:</strong> {mascota.otro_animal || "No especificado"}</p>
                  ) : (
                    <p><strong>Raza:</strong> {mascota.raza || "No especificada"}</p>
                  )}

                  {tipoMascota === "Perro" && (
                    <p><strong>Tamaño:</strong> {mascota.tamano || "No especificado"}</p>
                  )}

                  <p><strong>Edad:</strong> {mascota.edad || "No especificada"}</p>
                  <p><strong>Descripción:</strong> {mascota.descripcion || "Sin descripción"}</p>

                  {mascota.imagen && (
                    <img
                      src={`http://localhost:3001${mascota.imagen}`}
                      alt={mascota.nombre}
                      style={{
                        width: "140px",
                        height: "140px",
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

        <GeoJSON data={{ type: "FeatureCollection", features: [] }} />
      </MapContainer>
    </div>
  );
}

export default Map;