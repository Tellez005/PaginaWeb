import { useState } from "react";

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
    <div>
      <div>
        <h1>Mascota nombre: <span>{nombre}</span></h1>
      </div>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <div>
        <h1>Mascota raza: <span>{raza}</span></h1>
      </div>
      <input
        type="text"
        value={raza}
        onChange={(e) => setRaza(e.target.value)}
      />

      <div>
        <h1>Mascota edad: <span>{edad}</span></h1>
      </div>
      <input
        type="number"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
      />

      <div>
        <h1>Mascota latitud: <span>{lat}</span></h1>
      </div>
      <input
        type="number"
        step="any"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />

      <div>
        <h1>Mascota longitud: <span>{lng}</span></h1>
      </div>
      <input
        type="number"
        step="any"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />

      <div>
        <h1>Mascota descripción: <span>{descripcion}</span></h1>
      </div>
      <input
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <div>
        <h1>Imagen de la mascota</h1>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImagen}
      />

      {preview && (
        <div>
          <p>Vista previa:</p>
          <img src={preview} alt="Vista previa" width="200" />
        </div>
      )}

      <button onClick={addMascota}>Mandar Datos</button>
    </div>
  );
}

export default AgregarMascota;