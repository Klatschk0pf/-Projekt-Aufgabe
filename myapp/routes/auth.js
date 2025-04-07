const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');

// Konfiguration von Multer für den Datei-Upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, basename + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

// GET: Registrierungsseite anzeigen
router.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './views' });
});

// POST: Registrierung verarbeiten
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.send('Benutzername existiert bereits. <a href="/register">Zurück</a>');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );
    req.session.user = { id: result.insertId, username };
    res.redirect('/profil.html');
  } catch (err) {
    console.error('Registrierungsfehler:', err);
    res.status(500).send('Fehler bei der Registrierung');
  }
});

// GET: Login-Seite anzeigen
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});

// POST: Login verarbeiten
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.user = { id: user.id, username: user.username };
      res.redirect('/profil.html');
    } else {
      res.send('Ungültiger Benutzername oder Passwort. <a href="/login">Zurück</a>');
    }
  } catch (err) {
    console.error('Login-Fehler:', err);
    res.status(500).send('Fehler beim Login');
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// API: Profildaten abrufen
router.get('/api/profil', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Nicht eingeloggt' });
  }
  try {
    const [rows] = await db.query(
      'SELECT username, name, gender, birthday, profile_picture FROM users WHERE id = ?',
      [req.session.user.id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
  } catch (err) {
    console.error('Fehler beim Abrufen des Profils:', err);
    res.status(500).json({ error: 'Fehler beim Laden des Profils' });
  }
});

// API: Profil bearbeiten (inkl. Bild-Upload)
router.post('/api/profil-bearbeiten', upload.single('profile_picture'), async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('Nicht eingeloggt');
  }
  
  const { name, gender, birthday } = req.body;
  let profilePictureUrl = null;
  if (req.file) {
    profilePictureUrl = '/uploads/' + req.file.filename;
  }
  
  try {
    if (profilePictureUrl) {
      await db.query(
        `UPDATE users SET name = ?, gender = ?, birthday = ?, profile_picture = ? WHERE id = ?`,
        [name || null, gender || null, birthday || null, profilePictureUrl, req.session.user.id]
      );
    } else {
      await db.query(
        `UPDATE users SET name = ?, gender = ?, birthday = ? WHERE id = ?`,
        [name || null, gender || null, birthday || null, req.session.user.id]
      );
    }
    res.status(200).send('OK');
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Profils:', err);
    res.status(500).send('Fehler beim Aktualisieren');
  }
});

module.exports = router;
