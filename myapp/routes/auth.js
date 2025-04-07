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

// GET: Filterseite anzeigen
router.get('/filter', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile('filter.html', { root: './views' });
});

// POST: Filtereinstellungen in Session speichern
router.post('/setFilter', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const { gender, minAge, maxAge } = req.body;
  req.session.filter = { gender, minAge: parseInt(minAge), maxAge: parseInt(maxAge) };
  res.redirect('/people');
});

// GET: People-Seite anzeigen
router.get('/people', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile('people.html', { root: './views' });
});

// API: Zufälliges Profil basierend auf Filtereinstellungen abrufen
router.get('/api/people', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  
  let filter = req.session.filter || {};
  
  const genderFilter = filter.gender || '';
  const minAge = filter.minAge || 18;
  const maxAge = filter.maxAge || 100;
  
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - maxAge;
  const maxYear = currentYear - minAge;
  
  try {
    // Suche einen zufälligen Nutzer (außer dem aktuellen) der noch nicht bewertet wurde
    let query = `SELECT id, username, name, gender, birthday, profile_picture 
                 FROM users 
                 WHERE id != ?
                 AND id NOT IN (SELECT target_user_id FROM matches WHERE user_id = ?)`; 
    const params = [req.session.user.id, req.session.user.id];
    
    if (genderFilter) {
      query += ' AND gender = ?';
      params.push(genderFilter);
    }
    
    query += ' AND YEAR(birthday) BETWEEN ? AND ? ORDER BY RAND() LIMIT 1';
    params.push(minYear, maxYear);
    
    const [rows] = await db.query(query, params);
    
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Kein Profil gefunden, das dem Filter entspricht.' });
    }
  } catch (err) {
    console.error('Fehler beim Laden des People-Profils:', err);
    res.status(500).json({ error: 'Fehler beim Laden des People-Profils' });
  }
});

// API: Like/Dislike (Match) speichern – jeder Like/Dislike wird nur einmal erfasst
router.post('/api/match', async (req, res) => {
  if (!req.session.user) return res.status(401).send('Nicht eingeloggt');
  
  console.log('Match Anfrage erhalten:', req.body);
  
  let { targetUserId, like } = req.body;
  
  // Wandelt targetUserId in eine Zahl um
  targetUserId = Number(targetUserId);
  
  if (isNaN(targetUserId) || typeof like !== 'boolean') {
    console.warn('Ungültige Match-Daten:', req.body);
    return res.status(400).send('Ungültige Anfrage');
  }
  
  try {
    const [existing] = await db.query(
      'SELECT id FROM matches WHERE user_id = ? AND target_user_id = ?',
      [req.session.user.id, targetUserId]
    );
    
    if (existing.length > 0) {
      return res.status(400).send('Du hast diesen Nutzer bereits bewertet.');
    }
    
    await db.query(
      'INSERT INTO matches (user_id, target_user_id, `like`) VALUES (?, ?, ?)',
      [req.session.user.id, targetUserId, like ? 1 : 0]
    );
    res.status(200).send('Bewertung gespeichert');
  } catch (err) {
    console.error('Fehler beim Speichern der Bewertung:', err);
    res.status(500).send('Fehler beim Speichern der Bewertung');
  }
});

// API: Mutual Matches abrufen (Liste der Nutzer, die sich gegenseitig geliked haben)
router.get('/api/matches', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  try {
    const userId = req.session.user.id;
    const query = `
      SELECT u.id, u.username, u.name, u.profile_picture
      FROM matches m1
      JOIN matches m2 ON m1.target_user_id = m2.user_id
      JOIN users u ON u.id = m1.target_user_id
      WHERE m1.user_id = ? AND m2.target_user_id = ? AND m1.like = 1 AND m2.like = 1
    `;
    const [rows] = await db.query(query, [userId, userId]);
    res.json(rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Matches:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Matches' });
  }
});

// GET: Matches Seite anzeigen
router.get('/matches', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile('matches.html', { root: './views' });
});

module.exports = router;
