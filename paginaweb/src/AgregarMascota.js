import { useState } from "react";
import "./AgregarMascota.css";
function AgregarMascota() {
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState("");

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
        alert("Llena todos los campos");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("raza", raza);
      formData.append("edad", edad);
      formData.append("lat", lat);
      formData.append("lng", lng);
      formData.append("descripcion", descripcion);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const response = await fetch("http://localhost:3001/api/mascotas", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      console.log(data);

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
          <input
            type="text"
            value={raza}
            onChange={(e) => setRaza(e.target.value)}
          />
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
          <label>Latitud</label>
          <input
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>

        <div className="agregar-mascota-grupo">
          <label>Longitud</label>
          <input
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
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