const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const { error } = require('console');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'), (err) => {
    if (err) {
        console.log('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a SQLite');
    }
});

app.get('/prueba', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get('/mascotas', (req, res) => {
    db.all('SELECT * FROM mascotas', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/mascotas', (req,res)=>{
    const nombre = req.body.nombre; 
    const raza = req.body.raza; 
    const edad = req.body.edad; 
    const lat = req.body.lat; 
    const lng = req.body.lng;
    const descripcion = req.body.descripcion; 
    const insertar = "INSERT into Mascotas (nombre, raza, edad, lat, lng, descripcion) VALUES (?,?,?,?,?,?)";
    db.run(insertar, [nombre,raza,edad,lat,lng,descripcion], function(error){
        if(error){
            res.status(500).json({
                message: "Error, no se guardo en el sistema",
                error: error.message
            }); 
            return; 
        }
        res.status(201).json({
            mensaje: "Se guardo la mascota", 
            id: this.lastID
        })
    })
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});