const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uploadsPath = path.join(__dirname, 'uploads');
const dbPath = path.join(__dirname, 'db.sqlite');

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use('/uploads', express.static(uploadsPath));

console.log('Base de datos usada:', dbPath);
console.log('Carpeta de uploads:', uploadsPath);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a SQLite');
    }
});

// Crear tabla users si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

// Crear tabla mascotas si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS mascotas (
    id_mascota INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    raza TEXT,
    edad INTEGER,
    lat REAL,
    lng REAL,
    descripcion TEXT,
    imagen TEXT
  )
`);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsPath);
    },
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage });

// Signup POST
app.post('/signup', (req, res) => {
    const sql = 'INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)';
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.run(sql, values, function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json("Error");
        }
        return res.json({ id: this.lastID });
    });
});

app.put('/mascotas/:id', (req, res) => {
    const idMascota = req.params.id;

    const {
        nombre,
        raza,
        edad,
        descripcion,
        tamano,
        otro_animal,
        estado,
        id_user
    } = req.body;

    db.run(
        `UPDATE mascotas
         SET nombre = ?, raza = ?, edad = ?, descripcion = ?, tamano = ?, otro_animal = ?, estado = ?
         WHERE id_mascota = ? AND id_user = ?`,
        [
            nombre,
            raza,
            edad,
            descripcion,
            tamano,
            otro_animal,
            estado,
            idMascota,
            id_user
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(403).json({
                    error: 'Solo el creador puede editar este post'
                });
            }

            res.json({ mensaje: 'Post actualizado correctamente' });
        }
    );
});
//A
app.delete('/mascotas/:id', (req, res) => {
    const idMascota = req.params.id;
    const { id_user } = req.body;

    db.run(
        `DELETE FROM mascotas WHERE id_mascota = ? AND id_user = ?`,
        [idMascota, id_user],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(403).json({
                    error: 'Solo el creador puede eliminar este post'
                });
            }

            res.json({ mensaje: 'Post eliminado correctamente' });
        }
    );
});


// Login POST
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    const values = [
        req.body.email,
        req.body.password
    ];

    db.all(sql, values, (err, rows) => {
        if (err) {
            return res.status(500).json({ status: "Error" });
        }

        if (rows.length > 0) {
            return res.json({
                status: "Success",
                id_user: rows[0].id_user
            });
        } else {
            return res.json({
                status: "Failed"
            });
        }
    });
});

// Ver tablas
app.get('/prueba', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Obtener mascotas
app.get('/mascotas', (req, res) => {
    db.all('SELECT * FROM mascotas', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/mascotas', upload.single('imagen'), (req, res) => {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const {
        nombre,
        raza,
        edad,
        lat,
        lng,
        descripcion,
        id_user,
        id_tipo,
        tamano,
        otro_animal
    } = req.body;

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const insertar = `
        INSERT INTO mascotas 
        (nombre, raza, edad, lat, lng, descripcion, imagen, id_user, id_tipo, tamano, otro_animal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        insertar,
        [
            nombre,
            raza,
            edad,
            lat,
            lng,
            descripcion,
            imagen,
            id_user,
            id_tipo,
            tamano,
            otro_animal
        ],
        function (error) {
            if (error) {
                console.log('ERROR SQLITE:', error);
                return res.status(500).json({
                    message: 'Error, no se guardó en el sistema',
                    error: error.message
                });
            }

            res.status(201).json({
                mensaje: 'Se guardó la mascota',
                id: this.lastID,
                imagen: imagen
            });
        }
    );
});

app.put('/mascotas/:id/estado', (req, res) => {
    const idMascota = req.params.id;
    const { estado, id_user } = req.body;

    db.run(
        `UPDATE mascotas SET TEXT = ? WHERE id_mascota = ? AND id_user = ?`,
        [estado, idMascota, id_user],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(403).json({ error: 'No tienes permiso' });
            }

            res.json({ mensaje: 'Estado actualizado correctamente' });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});