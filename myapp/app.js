const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const db = require('./models/db');

const app = express();
const PORT = 3001;

// Middleware zum Parsen von JSON und URL-codierten POST-Daten
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statische Dateien
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// Session-Konfiguration
app.use(session({
  secret: 'geheimes-super-passwort',
  resave: false,
  saveUninitialized: false
}));

// Routen
app.use('/', authRoutes);

// Root-Route leitet auf /login weiter
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Erst die Datenbank initialisieren, dann Server starten
async function startServer() {
  await new Promise(resolve => setTimeout(resolve, 200)); // Kurzes Delay für saubere Logs
  console.log('🚀 Initialisiere Datenbank...');
  await db; // Wartet auf Ausführung in db.js
  app.listen(PORT, () => {
    console.log(`✅ Server läuft auf http://localhost:${PORT}`);
  });
}

startServer();
