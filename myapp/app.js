const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Middleware zum Parsen von POST-Daten
app.use(express.urlencoded({ extended: true }));

// Session-Konfiguration
app.use(session({
  secret: 'geheimes-super-passwort',
  resave: false,
  saveUninitialized: false
}));

// Statische Dateien aus dem views-Ordner
app.use(express.static(path.join(__dirname, 'views')));

// Routen
app.use('/', authRoutes);

// Root-Route leitet auf /login weiter
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
