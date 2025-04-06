const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');


// GET: Login-Seite
router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './views' });
});

// POST: Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.send('❌ Benutzer nicht gefunden. <a href="/login">Zurück</a>');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (isMatch) {
      req.session.user = {
        id: user.id,
        username: user.username,
        name: user.name,
        gender: user.gender
      };
      return res.redirect('/profile');
    } else {
      return res.send('❌ Falsches Passwort. <a href="/login">Zurück</a>');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('❌ Fehler beim Login.');
  }
});

// GET: Registrierungsseite
router.get('/register', (req, res) => {
  res.sendFile('register.html', { root: './views' });
});

// POST: Registrierung
router.post('/register', async (req, res) => {
  const { username, password, name, gender, birthday } = req.body;

  try {
    const [exists] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (exists.length > 0) {
      return res.send('❌ Benutzername existiert bereits. <a href="/register">Zurück</a>');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(`
      INSERT INTO users (username, password_hash, name, gender, birthday)
      VALUES (?, ?, ?, ?, ?)
    `, [username, passwordHash, name, gender, birthday]);

    return res.redirect('/login');
  } catch (error) {
    console.error(error);
    return res.status(500).send('❌ Fehler bei der Registrierung.');
  }
});

// GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// GET: Profilseite
router.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.sendFile('profil.html', { root: './views' });
});

module.exports = router;
