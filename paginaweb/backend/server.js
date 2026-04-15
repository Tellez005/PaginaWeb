const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'), (err) => {
    if (err) {
        console.log('Error al conectar a SQLite:', err.message);
    } else {
        console.log('Conectado a SQLite');
    }
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const nombreUnico = Date.now() + path.extname(file.originalname);
        cb(null, nombreUnico);
    }
});

const upload = multer({ storage: storage });

// Signup POST
app.post('/signup', (req, res)=> {
    const sql = 'INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)'
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ]
    
    db.run(sql, values, function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json("Error");
        }
        return res.json({ id: this.lastID});
    })
})

app.post('/login', (req, res)=> {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ]
    
    db.all(sql, values, (err, rows) => {
        if (err) {
            return res.status(500).json("Error");
        }
        if (rows.length > 0) {
            return res.json("Success");
        } else {
            return res.json("Failed");
        }
    })
})

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

app.post('/api/mascotas', upload.single('imagen'), (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { nombre, raza, edad, lat, lng, descripcion } = req.body;
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const insertar = `
        INSERT INTO mascotas (nombre, raza, edad, lat, lng, descripcion, imagen)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertar, [nombre, raza, edad, lat, lng, descripcion, imagen], function(error) {
        if (error) {
            console.log("ERROR SQLITE:", error);
            res.status(500).json({
                message: "Error, no se guardo en el sistema",
                error: error.message
            });
            return;
        }

        res.status(201).json({
            mensaje: "Se guardo la mascota",
            id: this.lastID,
            imagen: imagen
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});