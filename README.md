# -Projekt-Aufgabe

### Dokumentation der API-Endpunkte

1. **POST: `/register`**
   - **Beschreibung**: Dieser Endpunkt verarbeitet die Registrierung eines neuen Nutzers.
   - **HTTP-Methode**: `POST`
   - **Erwartete Daten**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Antwort**:
     - **Erfolg**: Redirect zu `/profil.html`
     - **Fehler**: 
       - `400 Bad Request`: Benutzername existiert bereits
       - `500 Internal Server Error`: Fehler bei der Registrierung

2. **POST: `/login`**
   - **Beschreibung**: Dieser Endpunkt verarbeitet den Login eines Nutzers.
   - **HTTP-Methode**: `POST`
   - **Erwartete Daten**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Antwort**:
     - **Erfolg**: Redirect zu `/profil.html`
     - **Fehler**: 
       - `400 Bad Request`: Ungültiger Benutzername oder Passwort
       - `500 Internal Server Error`: Fehler beim Login

3. **GET: `/logout`**
   - **Beschreibung**: Dieser Endpunkt loggt den aktuellen Nutzer aus und zerstört die Session.
   - **HTTP-Methode**: `GET`
   - **Antwort**: Redirect zu `/login`

4. **GET: `/api/profil`**
   - **Beschreibung**: Dieser Endpunkt gibt die Profildaten des aktuell eingeloggenen Nutzers zurück.
   - **HTTP-Methode**: `GET`
   - **Antwort**:
     - **Erfolg**:
       ```json
       {
         "username": "string",
         "name": "string",
         "gender": "string",
         "birthday": "string",
         "profile_picture": "string"
       }
       ```
     - **Fehler**:
       - `401 Unauthorized`: Nicht eingeloggt
       - `404 Not Found`: Benutzer nicht gefunden
       - `500 Internal Server Error`: Fehler beim Abrufen des Profils

5. **POST: `/api/profil-bearbeiten`**
   - **Beschreibung**: Dieser Endpunkt ermöglicht es dem aktuell eingeloggenen Nutzer, seine Profildaten zu bearbeiten (inklusive Upload eines Profilbildes).
   - **HTTP-Methode**: `POST`
   - **Erwartete Daten**:
     ```json
     {
       "name": "string",
       "gender": "string",
       "birthday": "string",
       "profile_picture": "file" // Optional
     }
     ```
   - **Antwort**:
     - **Erfolg**: `200 OK`
     - **Fehler**:
       - `401 Unauthorized`: Nicht eingeloggt
       - `500 Internal Server Error`: Fehler beim Bearbeiten des Profils

6. **POST: `/setFilter`**
   - **Beschreibung**: Dieser Endpunkt speichert die Filtereinstellungen für die Suche nach anderen Nutzern (z.B. Geschlecht, Alter).
   - **HTTP-Methode**: `POST`
   - **Erwartete Daten**:
     ```json
     {
       "gender": "string",
       "minAge": "integer",
       "maxAge": "integer"
     }
     ```
   - **Antwort**: Redirect zu `/people`

7. **GET: `/api/people`**
   - **Beschreibung**: Dieser Endpunkt gibt ein zufälliges Nutzerprofil zurück, das den aktuellen Filtereinstellungen entspricht.
   - **HTTP-Methode**: `GET`
   - **Antwort**:
     - **Erfolg**:
       ```json
       {
         "id": "integer",
         "username": "string",
         "name": "string",
         "gender": "string",
         "birthday": "string",
         "profile_picture": "string"
       }
       ```
     - **Fehler**:
       - `401 Unauthorized`: Nicht eingeloggt
       - `404 Not Found`: Kein passendes Profil gefunden
       - `500 Internal Server Error`: Fehler beim Abrufen des Profils

8. **POST: `/api/match`**
   - **Beschreibung**: Dieser Endpunkt ermöglicht es einem Nutzer, einem anderen Nutzer ein Like oder Dislike zu geben.
   - **HTTP-Methode**: `POST`
   - **Erwartete Daten**:
     ```json
     {
       "targetUserId": "integer",
       "like": "boolean"
     }
     ```
   - **Antwort**:
     - **Erfolg**: `200 OK`
     - **Fehler**:
       - `401 Unauthorized`: Nicht eingeloggt
       - `400 Bad Request`: Ungültige Anfrage (z.B. ungültiger `targetUserId`)
       - `500 Internal Server Error`: Fehler beim Speichern der Bewertung

9. **GET: `/api/likesReceived`**
   - **Beschreibung**: Dieser Endpunkt gibt alle Nutzer zurück, die den aktuellen Nutzer geliked haben.
   - **HTTP-Methode**: `GET`
   - **Antwort**:
     - **Erfolg**:
       ```json
       [
         {
           "id": "integer",
           "username": "string",
           "name": "string",
           "profile_picture": "string"
         },
         ...
       ]
       ```
     - **Fehler**:
       - `401 Unauthorized`: Nicht eingeloggt
       - `500 Internal Server Error`: Fehler beim Abrufen der Likes

10. **GET: `/api/likesGiven`**
    - **Beschreibung**: Dieser Endpunkt gibt alle Nutzer zurück, die der aktuelle Nutzer geliked hat.
    - **HTTP-Methode**: `GET`
    - **Antwort**:
      - **Erfolg**:
        ```json
        [
          {
            "id": "integer",
            "username": "string",
            "name": "string",
            "profile_picture": "string"
          },
          ...
        ]
        ```
      - **Fehler**:
        - `401 Unauthorized`: Nicht eingeloggt
        - `500 Internal Server Error`: Fehler beim Abrufen der Likes

11. **GET: `/api/matches`**
    - **Beschreibung**: Dieser Endpunkt gibt alle gegenseitigen Matches (Likes von beiden Nutzern) zurück.
    - **HTTP-Methode**: `GET`
    - **Antwort**:
      - **Erfolg**:
        ```json
        [
          {
            "id": "integer",
            "username": "string",
            "name": "string",
            "profile_picture": "string"
          },
          ...
        ]
        ```
      - **Fehler**:
        - `401 Unauthorized`: Nicht eingeloggt
        - `500 Internal Server Error`: Fehler beim Abrufen der Matches


Hier ist eine Übersicht der Ordner- und Dateistruktur meiner Tinda Anwendung:

### Verzeichnisstruktur der Anwendung

```plaintext
myapp
├── app.js                  # Hauptanwendungsdatei, die den Server startet und die Routen lädt.
├── bin
│   └── www                 # Startskript für die Anwendung, das den Express-Server startet.
├── models
│   └── db.js               # Datenbankmodul für Verbindung zur MySQL-Datenbank und Abfragen.
├── node_modules            # Enthält alle installierten Abhängigkeiten (aus Doku entfernt).
├── package-lock.json       # Speichert die genaue Version der installierten Pakete.
├── package.json            # Konfigurationsdatei mit Abhängigkeiten und Skripten.
├── public
│   ├── css
│   │   └── style.css       # Wird nicht genutzt – stattdessen CSS direkt in HTML definiert.
│   ├── images              # Ordner für allgemeine Bilder.
│   ├── js                  # JavaScript-Dateien für Frontend-Logik.
│   └── uploads             # Hochgeladene Profilbilder.
│       ├── test-1744010996112.jpg
│       ├── test-1744011712956.jpg
│       └── test-1744012202022.jpg
├── routes
│   ├── auth.js             # Routen für Registrierung, Login, Logout, Profilfunktionen.
│   ├── index.js            # Allgemeine Routen (derzeit nicht verwendet).
│   └── users.js            # Weitere Benutzer-bezogene Routen (optional).
└── views
    ├── filter.html         # Seite zur Einstellung von Filterkriterien.
    ├── login.html          # Login-Seite.
    ├── matches.html        # Anzeige der Matches.
    ├── people.html         # Swipe-Ansicht für andere Nutzer.
    ├── profil-bearbeiten.html # Seite zum Bearbeiten des eigenen Profils.
    ├── profil.html         # Anzeige des eigenen Profils.
    └── register.html       # Registrierungsseite.
```


### Erläuterung der Umsetzung

#### Entwicklungsprozess

Die Entwicklung der Web-Anwendung erfolgte in mehreren Phasen, die von der Planung über die Implementierung bis hin zur Bereitstellung reichten. Im Folgenden wird der grundlegende Ablauf der Entwicklung beschrieben:

1. **Planung und Anforderungsanalyse**:
   Zu Beginn wurde der Funktionsumfang der Anwendung festgelegt. Es sollte eine Dating-Plattform entwickelt werden, bei der Benutzer Profile erstellen, sich anmelden, ihr Profil bearbeiten und mit anderen Benutzern interagieren können. Auch ein System zum „Liken“ und „Disliken“ von Nutzern sowie die Möglichkeit von „Mutual Matches“ wurde festgelegt.

2. **Datenbankdesign**:
   Um die Benutzerprofile und deren Interaktionen zu speichern, wurde eine MySQL-Datenbank entworfen. Die wichtigsten Tabellen in der Datenbank umfassen:
   - **users**: Enthält alle Benutzerdaten, einschließlich Anmeldeinformationen und Profildaten.
   - **matches**: Speichert die Interaktionen der Benutzer untereinander (Likes, Dislikes, und Mutual Matches).

3. **Backend-Entwicklung**:
   Das Backend der Anwendung wurde mit **Node.js** und **Express.js** entwickelt. Die Express.js-Serverstruktur wurde genutzt, um API-Endpunkte für die Benutzerinteraktionen bereitzustellen. Der Authentifizierungsprozess erfolgt über die Erstellung eines sicheren Passwort-Hashes und die Verwendung von **Sessions**, um Benutzer angemeldet zu halten. 

4. **Frontend-Entwicklung**:
   Das Frontend wurde mit **HTML**, **CSS** und **JavaScript** entwickelt. Die Benutzeroberflächen wurden mithilfe von HTML und CSS erstellt, wobei grundlegende Interaktivität und Benutzererfahrung durch JavaScript verbessert wurden. Die Benutzerschnittstellen umfassen Formulare zur Registrierung und Anmeldung, Seiten zur Profilbearbeitung, eine Seite zur Profilsuche und -anzeige sowie eine Seite für die Anzeige von Matches.

5. **Datenverarbeitung**:
   Für das Abrufen und Bearbeiten von Benutzerdaten sowie das Speichern von Likes und Dislikes wurde die MySQL-Datenbank verwendet. SQL-Abfragen wurden zur Interaktion mit der Datenbank genutzt. Auch Filtereinstellungen für die Profilsuche wurden durch SQL-Abfragen realisiert, die Benutzerdaten basierend auf den Kriterien wie Geschlecht und Alter filtern.

6. **Datei-Upload**:
   Die Möglichkeit, ein Profilbild hochzuladen, wurde mit Hilfe von **Multer** realisiert, einem Middleware-Modul für Express, das Dateiuploads verarbeitet. Hierbei werden Bilder auf dem Server gespeichert und mit einer URL verknüpft, die im Profil des Benutzers angezeigt wird.

7. **Testing und Fehlerbehebung**:
   Nach der Implementierung der Funktionalitäten wurde die Anwendung getestet, um sicherzustellen, dass die Logik wie erwartet funktioniert. Es wurden sowohl manuelle Tests durchgeführt (z.B. Überprüfung der Registrierung und Login-Prozesse) als auch Tests für spezifische Features wie das Liken und Disliken von Benutzern.

8. **Bereitstellung**:
   Nachdem alle grundlegenden Funktionen und Tests abgeschlossen waren, wurde die Anwendung auf einem lokalen Server getestet. Anschließend war die Implementierung auf einer Produktionsumgebung (z.B. auf einem Server oder über einen Cloud-Dienst wie Heroku) vorgesehen.

---

#### Architektur der Anwendung

Die Architektur der Anwendung basiert auf dem klassischen **Client-Server-Modell**, wobei die Kommunikation zwischen dem Frontend und dem Backend über HTTP-Anfragen und -Antworten erfolgt. Das Backend ist auf **Node.js** und **Express.js** aufgebaut, während das Frontend hauptsächlich aus statischen HTML-Dateien besteht. 

Die Architektur kann in folgende Bereiche unterteilt werden:

1. **Frontend (Client-Side)**:
   - **HTML** und **CSS** werden verwendet, um die Benutzeroberfläche zu gestalten. 
   - **JavaScript** sorgt für dynamische Interaktionen und die Kommunikation mit dem Server über **AJAX**-Anfragen (z.B. das Abrufen von Profildaten oder das Absenden von „Like“-Anfragen).
   - Benutzer können ihre Profildaten einsehen, bearbeiten und mit anderen Nutzern interagieren.

2. **Backend (Server-Side)**:
   - **Node.js** stellt die Serverumgebung bereit und sorgt für das Management der Anfragen.
   - **Express.js** dient als Framework für den HTTP-Server und bietet die Routen-Logik für die verschiedenen API-Endpunkte (z.B. für die Registrierung, das Abrufen von Profildaten und das Matchmaking).
   - **Session-Management**: Die Anwendung verwendet **express-session**, um die Benutzersitzung zu verwalten und die Authentifizierung aufrechtzuerhalten.
   - **MySQL-Datenbank** speichert alle Benutzerdaten und Interaktionen zwischen den Nutzern.
   - **Multer** wird für den Datei-Upload von Profilbildern genutzt.

3. **Datenbank (MySQL)**:
   - **Benutzerdaten**: In der `users`-Tabelle werden alle Benutzerdaten wie Benutzername, Passwort-Hash, Name, Geburtsdatum und Profilbild gespeichert.
   - **Interaktionen (Likes/Dislikes)**: In der `matches`-Tabelle werden die Likes und Dislikes gespeichert, um die Benutzerinteraktionen zu verfolgen und Mutual Matches zu erkennen.
   - **Abfragen und Filter**: SQL-Abfragen werden genutzt, um Benutzer nach bestimmten Kriterien wie Alter und Geschlecht zu filtern und um die zufälligen Profile anzuzeigen.

4. **Dateispeicherung**:
   - **Uploads**: Profilbilder und andere hochgeladene Dateien werden auf dem Server im Verzeichnis `public/uploads` gespeichert. Über **Multer** werden die Dateinamen und -pfade verwaltet, sodass die Bilder korrekt mit den Benutzerprofilen verknüpft werden können.

---

#### Verwendete Technologien

1. **Node.js**:
   - Eine JavaScript-Laufzeitumgebung, die es ermöglicht, serverseitige Anwendungen in JavaScript zu entwickeln. Sie wird als Grundlage für das Backend der Anwendung verwendet.

2. **Express.js**:
   - Ein flexibles Web-Framework für Node.js, das das Routing und die Middleware-Verwaltung übernimmt, um Anfragen von Clients zu empfangen und zu beantworten.

3. **MySQL**:
   - Eine relationale Datenbank, die zum Speichern der Benutzerdaten und Interaktionen verwendet wird. Die MySQL-Datenbank stellt sicher, dass alle Daten effizient gespeichert und abgerufen werden können.

4. **Bcrypt**:
   - Ein Modul zur sicheren Passwort-Hashing. Es wird verwendet, um Passwörter sicher zu speichern und bei der Anmeldung mit den eingegebenen Passwörtern zu vergleichen.

5. **Multer**:
   - Ein Middleware-Modul für Node.js, das für den Upload von Dateien zuständig ist, wie z.B. Profilbilder. Es sorgt dafür, dass die Bilder korrekt auf dem Server gespeichert und der Pfad in der Datenbank gespeichert wird.

6. **HTML/CSS/JavaScript**:
   - Standardtechnologien für die Frontend-Entwicklung. HTML wird verwendet, um die Struktur der Webseiten zu definieren, CSS für das Styling und JavaScript für die Interaktivität und AJAX-Anfragen an das Backend.

7. **Express-Session**:
   - Ein Modul, das für die Verwaltung von Benutzersitzungen zuständig ist, sodass Benutzer eingeloggt bleiben können und ihre Daten sicher gespeichert werden.

---

### Test-Dokumentation

#### 1. **Überblick der durchgeführten Tests**

Um die Funktionsfähigkeit und Stabilität der Web-Anwendung sicherzustellen, wurden verschiedene Tests durchgeführt. Die Tests konzentrierten sich auf die Kernfunktionen der Web-App, einschließlich Benutzerregistrierung, Login, Profilbearbeitung, und Matching-Funktionalität.

#### 2. **Funktionalitäten, die getestet wurden:**

- **Benutzerregistrierung:**
  - Test: Sicherstellen, dass ein Benutzer erfolgreich mit einem eindeutigen Benutzernamen und Passwort registriert werden kann.
  - Überprüfung: Validierung der Passwortsicherheit (durch Hashing) und der Speicherung der Benutzerdaten in der Datenbank.

- **Benutzer-Login:**
  - Test: Sicherstellen, dass sich ein Benutzer mit dem richtigen Benutzernamen und Passwort anmelden kann.
  - Überprüfung: Validierung der Passworteingabe durch den Vergleich mit dem Hash in der Datenbank.

- **Logout:**
  - Test: Sicherstellen, dass der Benutzer sich erfolgreich abmelden kann und die Sitzung beendet wird.

- **Profil anzeigen (API-Endpunkt `/api/profil`):**
  - Test: Überprüfen, dass die Profildaten korrekt angezeigt werden, wenn der Benutzer eingeloggt ist.
  - Überprüfung: Das System muss das Profil des eingeloggten Benutzers aus der Datenbank laden und korrekt zurückgeben.

- **Profil bearbeiten (API-Endpunkt `/api/profil-bearbeiten`):**
  - Test: Sicherstellen, dass der Benutzer seine Profildaten erfolgreich aktualisieren kann, einschließlich des Uploads eines Profilbildes.
  - Überprüfung: Überprüfung, ob die Änderungen in der Datenbank gespeichert werden und das Profilbild korrekt gespeichert und angezeigt wird.

- **Filtern von Nutzern (Filterseite):**
  - Test: Sicherstellen, dass die Filteroptionen für Geschlecht und Alter funktionieren und der Benutzer entsprechende Profile angezeigt bekommt.
  - Überprüfung: Testen, ob der Filter die gewünschten Ergebnisse zurückgibt und keine ungültigen Profile anzeigt.

- **Matching-Funktion (API-Endpunkt `/api/match`):**
  - Test: Sicherstellen, dass das System „Like“ und „Dislike“-Aktionen korrekt speichert und die Beziehungen in der Datenbank korrekt gepflegt werden.
  - Überprüfung: Validierung der Speicherung der Matches (einschließlich Fehlerbehandlung für doppelte Bewertungen).

- **Zufällige Profile (API-Endpunkt `/api/people`):**
  - Test: Überprüfen, dass der Benutzer ein zufälliges Profil basierend auf seinen Filtereinstellungen erhält.
  - Überprüfung: Sicherstellen, dass das Profil aus der richtigen Alters- und Geschlechtskategorie ausgewählt wird und dass der Benutzer keine eigenen Profile oder bereits bewerteten Profile angezeigt bekommt.

- **Likes und Matches anzeigen (API-Endpunkte `/api/likesReceived`, `/api/likesGiven`, `/api/matches`):**
  - Test: Sicherstellen, dass der Benutzer die richtigen Likes und gegenseitigen Matches angezeigt bekommt.
  - Überprüfung: Überprüfen der Beziehung zwischen den „Likes“ und der Anzeige der empfangenen und gegebenen Likes sowie der gegenseitigen Matches.

#### 3. **Mögliche zukünftige Tests:**

- **Fehlerbehandlung und Sicherheitstests:**
  - Testen, ob das System gegen SQL-Injektionen und andere gängige Angriffe geschützt ist.
  - Überprüfung, ob sensible Daten wie Passwörter sicher gespeichert werden und keine Sicherheitslücken bestehen.

- **Usability-Tests:**
  - Testen der Benutzeroberfläche (UI) und Benutzererfahrung (UX) mit echten Nutzern, um sicherzustellen, dass die Anwendung benutzerfreundlich ist.
  - Überprüfung, ob alle wichtigen Funktionen der Web-App intuitiv zugänglich sind und keine wichtigen Optionen oder Hinweise fehlen.

- **Leistungstests:**
  - Testen der Leistung und Skalierbarkeit der Anwendung unter hoher Last (z. B. bei einer großen Anzahl an Nutzern, Anfragen oder Daten).

- **Integrationstests:**
  - Sicherstellen, dass alle Teile der Anwendung (Frontend, Backend, Datenbank) gut zusammenarbeiten und keine Integrationsprobleme bestehen.

- **API-Tests:**
  - Sicherstellen, dass alle API-Endpunkte unter verschiedenen Bedingungen (z. B. mit ungültigen Daten, ohne Authentifizierung) wie erwartet funktionieren.

#### 4. **Testmethoden:**
- **Manuelle Tests:** 
  - Der größte Teil der Tests wurde manuell durchgeführt, indem Benutzeraktionen simuliert und das Verhalten der Anwendung überprüft wurden.
  
- **Automatisierte Tests:** 
  - In Zukunft könnten automatisierte Tests für die API und wichtige Funktionen erstellt werden, um Regressionstests effizienter durchzuführen.


### Benutzerdokumentation

#### 1. **Anmeldung**

- Um sich in der Anwendung anzumelden, besuchen Sie die Login-Seite.
- Geben Sie Ihren Benutzernamen und Ihr Passwort ein und klicken Sie auf "Login".
- Wenn die Anmeldedaten korrekt sind, werden Sie auf Ihre Profilseite weitergeleitet.
- Falls der Login fehlschlägt, überprüfen Sie bitte Ihren Benutzernamen und Ihr Passwort.

#### 2. **Registrierung**

- Wenn Sie noch keinen Account haben, können Sie sich über die Registrierungsseite anmelden.
- Geben Sie einen eindeutigen Benutzernamen sowie ein Passwort ein und bestätigen Sie die Registrierung.
- Nach der Registrierung werden Sie automatisch eingeloggt und auf Ihre Profilseite weitergeleitet.

#### 3. **Profil anzeigen und bearbeiten**

- Nach dem Login können Sie Ihre Profildaten auf Ihrer Profilseite einsehen.
- Um Ihr Profil zu bearbeiten, klicken Sie auf "Profil bearbeiten" und passen Sie Ihre Angaben an.
- Hier können Sie Ihren Namen, Geschlecht, Geburtsdatum und Profilbild ändern.
- Vergessen Sie nicht, auf "Speichern" zu klicken, um Ihre Änderungen zu übernehmen.

#### 4. **Profilbild hochladen**

- Während der Profilerstellung oder -bearbeitung können Sie ein Profilbild hochladen.
- Klicken Sie auf den Button zum Hochladen eines Bildes und wählen Sie eine Datei von Ihrem Computer aus.
- Das Bild wird auf der Plattform gespeichert und als Ihr Profilbild angezeigt.

#### 5. **Nutzer filtern**

- Über die Filterseite können Sie nach Nutzern filtern, die Ihren Kriterien entsprechen (z. B. Geschlecht, Altersgruppe).
- Wählen Sie die gewünschten Filter aus und klicken Sie auf "Filter anwenden".
- Die Anwendung zeigt Ihnen nun nur noch die Nutzer, die den ausgewählten Kriterien entsprechen.

#### 6. **People-Seite (Zufällige Profile)**

- Die People-Seite zeigt Ihnen zufällige Profile an, basierend auf Ihren Filtereinstellungen.
- Wenn Ihnen ein Profil gefällt, können Sie es liken. Wenn nicht, können Sie das Profil überspringen.

#### 7. **Matches**

- Wenn Sie ein Profil liken und der andere Nutzer Sie ebenfalls mag, wird ein Match erstellt.
- Sie können Ihre Matches auf der "Matches"-Seite einsehen, um zu sehen, mit welchen Nutzern es eine gegenseitige Übereinstimmung gibt.
- Hier sehen Sie, wer Sie geliked hat und mit wem Sie gegenseitige Likes erhalten haben.

#### 8. **Logout**

- Um sich aus der Anwendung abzumelden, klicken Sie einfach auf "Logout" in der oberen Navigationsleiste.
- Nach dem Logout werden Sie zur Login-Seite weitergeleitet und Ihre Sitzung wird beendet.






    

