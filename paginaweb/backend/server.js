const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const app = express();
const PORT = 3001;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', methods: ['GET', 'POST']
    }
});

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

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS mascotas (
    id_mascota INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    raza TEXT,
    edad INTEGER,
    lat REAL,
    lng REAL,
    descripcion TEXT,
    imagen TEXT,
    id_user INTEGER,
    id_tipo INTEGER,
    tamano TEXT,
    otro_animal TEXT,
    estado TEXT DEFAULT 'perdido',
    color TEXT,
    fecha_creacion DATETIME
  )
`);

// Tabla de Conversaciones entre dos usuarios
db.run(`
  CREATE TABLE IF NOT EXISTS conversations (
    id_conversation INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user1        INTEGER NOT NULL,
    id_user2        INTEGER NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_user1, id_user2),
    FOREIGN KEY (id_user1) REFERENCES users(id_user),
    FOREIGN KEY (id_user2) REFERENCES users(id_user)
  )
`);

// Tabla de Mensajes de cada conversación
db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id_message      INTEGER PRIMARY KEY AUTOINCREMENT,
    id_conversation INTEGER NOT NULL,
    id_sender       INTEGER NOT NULL,
    content         TEXT NOT NULL,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversation) REFERENCES conversations(id_conversation),
    FOREIGN KEY (id_sender)       REFERENCES users(id_user)
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

// ── Signup con hash de contraseña ─────
app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        const sql = 'INSERT INTO users (nombre, email, password) VALUES (?, ?, ?)';
        const values = [req.body.name, req.body.email, hashedPassword];

        db.run(sql, values, function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ status: "Error", error: err.message });
            }
            return res.json({
                status: "Success",
                id: this.lastID
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json("Error al hashear contraseña");
    }
});

// Login devuelve nombre, compara con bcrypt        
app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email = ?';

    db.get(sql, [req.body.email], async (err, user) => {
        if (err) {
            return res.status(500).json({ status: "Error", error: err.message });
        }

        if (!user) {
            return res.json({ status: "Failed" });
        }

        try {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                return res.json({
                    status: "Success",
                    id_user: user.id_user,
                    nombre: user.nombre
                });
            } else {
                return res.json({ status: "Failed" });
            }
        } catch (err) {
            return res.status(500).json({ status: "Error" });
        }
    });
});

app.get('/prueba', (req, res) => {
    db.all('SELECT name FROM sqlite_master WHERE type="table"', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
});

app.get('/mascotas', (req, res) => {
    db.all(`
        SELECT mascotas.*, users.nombre AS nombre_usuario
        FROM mascotas
        LEFT JOIN users ON mascotas.id_user = users.id_user
        ORDER BY mascotas.fecha_creacion DESC
    `, [], (err, rows) => {
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
        otro_animal,
        color
    } = req.body;

    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    const insertar = `
        INSERT INTO mascotas 
        (nombre, raza, edad, lat, lng, descripcion, imagen, id_user, id_tipo, tamano, otro_animal, color, fecha_creacion, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'perdido')
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
            otro_animal,
            color
        ],
        function (error) {
            if (error) {
                console.log('ERROR SQLITE:', error);
                return res.status(500).json({
                    message: 'Error, no se guardó en el sistema',
                    error: error.message
                });
            }
            res.status(201).json({ mensaje: 'Se guardó la mascota', id: this.lastID, imagen });
        }
    );
});

// Crear o recuperar conversación
app.post('/conversations', (req, res) => {
    const { id_user1, id_user2 } = req.body;
    const [u1, u2] = [Math.min(id_user1, id_user2), Math.max(id_user1, id_user2)];

    db.run(
        `INSERT OR IGNORE INTO conversations (id_user1, id_user2) VALUES (?, ?)`,
        [u1, u2],
        function () {
            db.get(
                `SELECT * FROM conversations WHERE id_user1 = ? AND id_user2 = ?`,
                [u1, u2],
                (err, row) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json(row);
                }
            );
        }
    );
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
        color,
        id_user
    } = req.body;

    db.run(
        `
        UPDATE mascotas
        SET nombre = ?,
            raza = ?,
            edad = ?,
            descripcion = ?,
            tamano = ?,
            otro_animal = ?,
            estado = ?,
            color = ?
        WHERE id_mascota = ? AND id_user = ?
        `,
        [
            nombre,
            raza,
            edad,
            descripcion,
            tamano,
            otro_animal,
            estado,
            color,
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

// Lista de conversaciones de un usuario
app.get('/conversations/:userId', (req, res) => {
    const { userId } = req.params;
    db.all(
        `SELECT c.*, u.nombre AS other_name
         FROM conversations c
         JOIN users u ON u.id_user = CASE
           WHEN c.id_user1 = ? THEN c.id_user2
           ELSE c.id_user1
         END
         WHERE c.id_user1 = ? OR c.id_user2 = ?
         ORDER BY c.created_at DESC`,
        [userId, userId, userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.put('/mascotas/:id/estado', (req, res) => {
    const idMascota = req.params.id;
    const { estado, id_user } = req.body;

    db.run(
        `
        UPDATE mascotas
        SET estado = ?
        WHERE id_mascota = ? AND id_user = ?
        `,
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

// Historial de mensajes
app.get('/messages/:convId', (req, res) => {
    db.all(
        `SELECT m.*, u.nombre AS sender_name
         FROM messages m
         JOIN users u ON u.id_user = m.id_sender
         WHERE m.id_conversation = ?
         ORDER BY m.created_at ASC`,
        [req.params.convId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.delete('/mascotas/:id', (req, res) => {
    const idMascota = req.params.id;
    const { id_user } = req.body;

    db.run(
        `
        DELETE FROM mascotas
        WHERE id_mascota = ? AND id_user = ?
        `,
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

// ── Socket.IO para chat en tiempo real ───────
io.on('connection', (socket) => {

    // El usuario se une a una sala y abandona la anterior si existía
    socket.on('join_conversation', (id_conversation) => {
        // Salir de cualquier sala de conversación previa
        const rooms = Array.from(socket.rooms).filter(r => r.startsWith('conv_'));
        rooms.forEach(room => socket.leave(room));

        socket.join(`conv_${id_conversation}`);
    });

    socket.on('send_message', ({ id_conversation, id_sender, content }) => {
        db.run(
            `INSERT INTO messages (id_conversation, id_sender, content) VALUES (?, ?, ?)`,
            [id_conversation, id_sender, content],
            function (err) {
                if (err) return;

                db.get(
                    `SELECT m.*, u.nombre AS sender_name FROM messages m
                     JOIN users u ON u.id_user = m.id_sender
                     WHERE m.id_message = ?`,
                    [this.lastID],
                    (err, message) => {
                        if (err) return;
                        io.to(`conv_${id_conversation}`).emit('receive_message', message);
                    }
                );
            }
        );
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));