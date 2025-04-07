const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '18459abn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });

    // Datenbank erstellen, falls nicht vorhanden
    await connection.query('CREATE DATABASE IF NOT EXISTS tinder_app');
    console.log('✅ Datenbank geprüft/erstellt');
    await connection.end();

    // Pool mit konkreter Datenbank herstellen
    pool = mysql.createPool({
      ...dbConfig,
      database: 'tinder_app'
    });

    // Tabellen erstellen/prüfen
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        gender ENUM('male', 'female', 'other'),
        birthday DATE,
        profile_picture VARCHAR(255)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        matched_user_id INT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (matched_user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Tabellen geprüft/erstellt');

    // Prüfen, ob bereits Benutzer existieren
    const [users] = await pool.query('SELECT COUNT(*) AS count FROM users');
    
    // Wenn keine Benutzer existieren, Dummy-Daten einfügen
    if (users[0].count === 0) {
      console.log('⚠️ Keine Benutzer gefunden, füge Dummy-Daten hinzu...');
      
      const dummyUsers = [
        ['john', '$2b$12$DTUIgW8ZpBNyFPQIh4KVXuGzDKnmHwfCnsfaZ.O3RtUJI02nw1wii', 'John', 'male', '1995-09-17', 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg'],
        ['paul', '$2b$12$ln.gPZFEj9n8/4HTMmGEreUmd2/hjOnIwZKcg6A95EssIjqzfbwxK', 'Paul', 'male', '1992-08-04', 'https://xsgames.co/randomusers/assets/avatars/male/2.jpg'],
        ['mike', '$2b$12$5m9BisjJJT/qWkqEu8KWhOHqovlcWX.JZig4zeXo2JdS5zjPtnZDS', 'Mike', 'male', '1991-01-03', 'https://xsgames.co/randomusers/assets/avatars/male/3.jpg'],
        ['david', '$2b$12$0SDcBeU427EbhrDo/iu6LuMz38Ajj2gJ8T1hTECK2GlR6HTbNgnzm', 'David', 'male', '1979-12-07', 'https://xsgames.co/randomusers/assets/avatars/male/4.jpg'],
        ['james', '$2b$12$4qw1A48R1u3E86tefum2y.Sd/Zft1Pbb7HIt4Fysn4r.DNZ/0L.zW', 'James', 'male', '1993-04-14', 'https://xsgames.co/randomusers/assets/avatars/male/5.jpg'],
        ['robert', '$2b$12$pgVEZLHDOBl4YCO18WJ.AOaGcWD0eFtRdX4lkdbGgtVNlBFYfxlUC', 'Robert', 'male', '1979-07-14', 'https://xsgames.co/randomusers/assets/avatars/male/6.jpg'],
        ['william', '$2b$12$K6DGw/yoWU2Gz7DQsnA/UOKdh7joohpqskL4IPJRjIpa4brfTtcAO', 'William', 'male', '1980-01-17', 'https://xsgames.co/randomusers/assets/avatars/male/7.jpg'],
        ['mark', '$2b$12$CaUba8g.gY7C5nyO19UtX.M.M6mXjCfeewrDBk5hOpIBS0n31cpf.', 'Mark', 'male', '1983-01-10', 'https://xsgames.co/randomusers/assets/avatars/male/8.jpg'],
        ['thomas', '$2b$12$cVoOuKGkrwwbS4y6QVrLS.Iu5d/BnEfN413R6DtC7Xmw0Y/WZWoOi', 'Thomas', 'male', '1984-10-25', 'https://xsgames.co/randomusers/assets/avatars/male/9.jpg'],
        ['joseph', '$2b$12$V8zY3VXccKq9Q8tYFS66rO6zdqmSTd77eJ/relWGV7hc9oWDtxvIu', 'Joseph', 'male', '1995-04-08', 'https://xsgames.co/randomusers/assets/avatars/male/10.jpg'],
        ['charles', '$2b$12$oSIkban0L9kzzH3DdYqN0.RJEnkgOFXEt5TtXZ7Ugm054yVfYjrbi', 'Charles', 'male', '1988-12-19', 'https://xsgames.co/randomusers/assets/avatars/male/11.jpg'],
        ['daniel', '$2b$12$5dpQLBGlodPvs/NiyDSQG.aTW1PVcZ/bUpl6sKY5MBYRao.9IdlrS', 'Daniel', 'male', '1982-02-12', 'https://xsgames.co/randomusers/assets/avatars/male/12.jpg'],
        ['matthew', '$2b$12$Js8lunOveEZQ3Ihmt4gv6eeLB2GAGoLkIeKdshmEaMcseTcY80PtW', 'Matthew', 'male', '1988-12-04', 'https://xsgames.co/randomusers/assets/avatars/male/13.jpg'],
        ['joshua', '$2b$12$lUqjVYjmyuxKCnswZL7HCeF4vIWWAar9YH1ScDRHLdhgQWsMJa4KK', 'Joshua', 'male', '1986-12-03', 'https://xsgames.co/randomusers/assets/avatars/male/14.jpg'],
        ['ethan', '$2b$12$LPm4bxK8YqoUrtwqX9ZxueNFz.TE5VS..SzqxP5qliHTwBPxkQV6a', 'Ethan', 'male', '1986-09-13', 'https://xsgames.co/randomusers/assets/avatars/male/15.jpg'],
        ['christopher', '$2b$12$ZhBzhcZCIhGaCPX7tXwoZu485S/y7y80VZNZmGib1YC4lYlyMHWZu', 'Christopher', 'male', '1970-09-20', 'https://xsgames.co/randomusers/assets/avatars/male/16.jpg'],
        ['anthony', '$2b$12$/tbV5YZe1A.T/VDY/uwkOueWxHKqQAi8TPuTGKBKy4Hh95cZ2NHEK', 'Anthony', 'male', '1990-09-24', 'https://xsgames.co/randomusers/assets/avatars/male/17.jpg'],
        ['steven', '$2b$12$3nB3MNnOJaLBgxXG4Q1qH.OK7FtTQSlbdMoJ1tPoHNvmMa6Mm39oC', 'Steven', 'male', '1983-09-25', 'https://xsgames.co/randomusers/assets/avatars/male/18.jpg'],
        ['andrew', '$2b$12$LgE1vv7odIT3J.FaMSjT2eI5TXIATl7KpUXGiQbcVMjYxjY.gV9Ei', 'Andrew', 'male', '1982-10-01', 'https://xsgames.co/randomusers/assets/avatars/male/19.jpg'],
        ['george', '$2b$12$R/XFamqIDNXuzIECnOH/IOVgHdGckXelkDDN8S1K055GSbbRwy9yq', 'George', 'male', '1990-03-26', 'https://xsgames.co/randomusers/assets/avatars/male/20.jpg'],
        ['kevin', '$2b$12$oUD/rpr6CR.V4Lv1FPBlIuVtGUBZtLQ24U.sx7i5EHKMwTFws01sO', 'Kevin', 'male', '1981-09-08', 'https://xsgames.co/randomusers/assets/avatars/male/21.jpg'],
        ['brian', '$2b$12$sopKHTNYKoFvmU/XwV2.EOI//szw52glKlkZ6drA5XDBHu9L2BZBC', 'Brian', 'male', '1978-01-21', 'https://xsgames.co/randomusers/assets/avatars/male/22.jpg'],
        ['aaron', '$2b$12$Q3y5DUx.F8RRl5UTVkc.O.ekuIekOBmisPdRFY3ixn5X5mIQQSYeO', 'Aaron', 'male', '1998-10-18', 'https://xsgames.co/randomusers/assets/avatars/male/23.jpg'],
        ['henry', '$2b$12$Wmo4csmFxRoY8WbBmGpKsuO1DzX84YUMlQCSiOeyQdsI0gPZSeoi2', 'Henry', 'male', '1980-01-02', 'https://xsgames.co/randomusers/assets/avatars/male/24.jpg'],
        ['jack', '$2b$12$sIUCE4Qc0OegTMrG8T3axOsOwTiyRyHcVdTACu6Ci7/5sA0j9H8AS', 'Jack', 'male', '1995-03-06', 'https://xsgames.co/randomusers/assets/avatars/male/25.jpg'],
        ['samuel', '$2b$12$fNKQTiomkMJYzaxGTKr0ZeKKpuSBgv9M9MaCA5XnDFTa4Jan03.M6', 'Samuel', 'male', '1991-04-03', 'https://xsgames.co/randomusers/assets/avatars/male/26.jpg'],
        ['david', '$2b$12$S7VxmVJbMQ4RNzW1FpB2W.CJui/0zKSnUodRkh3S.Km048pH8hEdy', 'David', 'male', '1994-03-24', 'https://xsgames.co/randomusers/assets/avatars/male/27.jpg'],
        ['richard', '$2b$12$axznjQTMkmLDctQidXXth.00mF.tGH7.ZeGaD9Wc9Ugsd5gwqfEBm', 'Richard', 'male', '1985-02-24', 'https://xsgames.co/randomusers/assets/avatars/male/28.jpg'],
        ['benjamin', '$2b$12$frOMdkiKcU.wh8F9f0RaxuBeHFHtwsqIuZraO3YVn6fs6I/yFUGf.', 'Benjamin', 'male', '1999-04-03', 'https://xsgames.co/randomusers/assets/avatars/male/29.jpg'],
        ['david', '$2b$12$2RUV6kYuUhwkb4lH2ltq7OiyuF4HDLTFbgDHKknYh5Ibnt4ZnU2AW', 'David', 'male', '1992-11-04', 'https://xsgames.co/randomusers/assets/avatars/male/30.jpg'],
        ['mary', '$2b$12$bDaS7eslm2ag8SAzNYBSJujw/ytN/fVGcgLABBvb9yeEE5gIqd7H6', 'Mary', 'female', '1986-02-12', 'https://xsgames.co/randomusers/assets/avatars/female/1.jpg'],
        ['jennifer', '$2b$12$SMCTjCFm4MBO5Qaa7xKFA.CVR0FDlWFUO4xELbLnZsG/AyMIt3XwG', 'Jennifer', 'female', '2000-10-18', 'https://xsgames.co/randomusers/assets/avatars/female/2.jpg'],
        ['linda', '$2b$12$mDqB0epBvw4hheqj197klO4Ijlbf64iq.z7qDSlWd15KHTb/JFJKe', 'Linda', 'female', '1998-10-26', 'https://xsgames.co/randomusers/assets/avatars/female/3.jpg'],
        ['patricia', '$2b$12$dzbbsgJe7j/7AHnJ3kbRJ.bV7qUFs/vQobkRI7yHzj7o35e5RJ9SW', 'Patricia', 'female', '1990-02-04', 'https://xsgames.co/randomusers/assets/avatars/female/4.jpg'],
        ['elizabeth', '$2b$12$Y3hsm1rn/LpA/XvcdZnscOvAynBEMlwhCVhh4hwfHCJ7dw.q9Jkji', 'Elizabeth', 'female', '1989-09-14', 'https://xsgames.co/randomusers/assets/avatars/female/5.jpg'],
        ['susan', '$2b$12$tnOvsUi1WCG5jotNpWhoM.aRsIVJsMIlEcNPnhBOF1wCX2K/IZE6i', 'Susan', 'female', '1972-01-18', 'https://xsgames.co/randomusers/assets/avatars/female/6.jpg'],
        ['jessica', '$2b$12$nJ3F/0lLYc08XTw6yDusU.gwJZ6YbNkCo4oUqRuSg41.t.JHUfG0S', 'Jessica', 'female', '1972-03-21', 'https://xsgames.co/randomusers/assets/avatars/female/7.jpg'],
        ['sarah', '$2b$12$yBO6e9xFtoUgblBcCOIhP.30p3Y/X/EfIgEpaQZq5H7LvvN8lNtuS', 'Sarah', 'female', '1976-12-27', 'https://xsgames.co/randomusers/assets/avatars/female/8.jpg'],
        ['karen', '$2b$12$EhCy4N/620JCpNVv/Xb2veXQP50K11sieHenwdxyKedbSVf1M4y0W', 'Karen', 'female', '1985-01-01', 'https://xsgames.co/randomusers/assets/avatars/female/9.jpg'],
        ['nancy', '$2b$12$IghEKtwW7HTHlJQRKekVnef3Ncenapkcql4Kb6cW0Zsl17AvPw7ha', 'Nancy', 'female', '1973-06-14', 'https://xsgames.co/randomusers/assets/avatars/female/10.jpg'],
        ['lisa', '$2b$12$jA4ExaMA9zXRAlYJrXcJiOHyhdkWByeES7CtjKcjtO3LkPnF6t1Za', 'Lisa', 'female', '1975-11-22', 'https://xsgames.co/randomusers/assets/avatars/female/11.jpg'],
        ['betty', '$2b$12$t1pJEBbMyc3/./xtBA.3YO4sM7ZsVW10C9X1MtPDkm.Ny/hDCc8T2', 'Betty', 'female', '1972-11-14', 'https://xsgames.co/randomusers/assets/avatars/female/12.jpg'],
        ['helen', '$2b$12$0sE7p7dIiP5tgRh/RX.Yz.ya39PLagxb87ATTEal5kxeE6dJwku9a', 'Helen', 'female', '1998-10-26', 'https://xsgames.co/randomusers/assets/avatars/female/13.jpg'],
        ['sandra', '$2b$12$/QOuLPLnSGS9eNgWvP4HbelBY9t31d/xwXcw0aOxX807f6s5EEB8e', 'Sandra', 'female', '1996-01-03', 'https://xsgames.co/randomusers/assets/avatars/female/14.jpg'],
        ['ashley', '$2b$12$nbDyLtdeTNK64JrrnnSx2Or0aqT8yEpD3NqInKCDDqOg0WVm5tSWW', 'Ashley', 'female', '1972-01-14', 'https://xsgames.co/randomusers/assets/avatars/female/15.jpg'],
        ['dorothy', '$2b$12$DwlN3hWjUSmetLsC3aippeeAUNM.Zze7uBjSUCRh9u.AQfWu51Emu', 'Dorothy', 'female', '1999-11-11', 'https://xsgames.co/randomusers/assets/avatars/female/16.jpg'],
        ['ruth', '$2b$12$HWy8TXANTTp0Q64YHc09B.Fm/DisaLEgOQv9MDDno.x9A6g3tbuDi', 'Ruth', 'female', '1992-10-02', 'https://xsgames.co/randomusers/assets/avatars/female/17.jpg'],
        ['sharon', '$2b$12$h00pKz71Llc9HVcFmKUvEeFkN7AJQVjk14tyoDFudj7T/qLOt3lbW', 'Sharon', 'female', '1970-08-23', 'https://xsgames.co/randomusers/assets/avatars/female/18.jpg'],
        ['cynthia', '$2b$12$ffkXkbreh9PH2aT0AAgnG.9GBvl1pnPSDvrfhPwMJfJ8Z4MYONM0i', 'Cynthia', 'female', '1994-11-18', 'https://xsgames.co/randomusers/assets/avatars/female/19.jpg'],
        ['angela', '$2b$12$d6sh/1nkAB4K8Aa67W3FOO/ElazDOys6osYsVgFUrGUspX2FQC8KC', 'Angela', 'female', '1987-10-24', 'https://xsgames.co/randomusers/assets/avatars/female/20.jpg'],
        ['margaret', '$2b$12$h1SHdAwpBHu6fu74EbZBQe4gcAdVC6nhDUAZBexOsrNKI2dOEJNRa', 'Margaret', 'female', '1981-07-28', 'https://xsgames.co/randomusers/assets/avatars/female/21.jpg'],
        ['marie', '$2b$12$ctpLcRra613g6O95QjWXEu89.VCfftx.kg/CEhvvO.ZhYLz3wTVVu', 'Marie', 'female', '1980-01-23', 'https://xsgames.co/randomusers/assets/avatars/female/22.jpg'],
        ['carol', '$2b$12$QTiWiHVe4sXlO3XtW2kPG.Ew6oT6FhWU8kbIybpjMwgJ5s6SLrB0y', 'Carol', 'female', '1983-12-13', 'https://xsgames.co/randomusers/assets/avatars/female/23.jpg'],
        ['michelle', '$2b$12$v9SZeESurIzk0Z0IzFZR6ueBfgluLF/eWsxmQCqsD3DOZNCb5AE4u', 'Michelle', 'female', '1994-01-26', 'https://xsgames.co/randomusers/assets/avatars/female/24.jpg'],
        ['dorothy', '$2b$12$9ImUrYMldImiaabQfwnPR.WYim2Fp.rAueGQpOrMkfohYQ9ODtHn.', 'Dorothy', 'female', '1997-07-19', 'https://xsgames.co/randomusers/assets/avatars/female/25.jpg'],
        ['amy', '$2b$12$D.UQaHYV/dCGIqOdvSZKCe.ywGzC3Bz7eYv12XPf2I46FvT0yFCqS', 'Amy', 'female', '1994-03-28', 'https://xsgames.co/randomusers/assets/avatars/female/26.jpg'],
        ['emily', '$2b$12$N3rW7P3P6UuhjOfKj6V8sOnyjjtymE5bJwwTNTNaqfGnNdF.cDAFG', 'Emily', 'female', '1970-02-17', 'https://xsgames.co/randomusers/assets/avatars/female/27.jpg'],
        ['joan', '$2b$12$fjrqafNYEUnOACGXDYrADO7zXKl5FX9vzhcYe4iXJH4F3gbwtDuvW', 'Joan', 'female', '1979-08-22', 'https://xsgames.co/randomusers/assets/avatars/female/28.jpg'],
        ['martha', '$2b$12$OG77W/Ehzdto2F5XgzdFrOm/XILQZG0./kLcMbJkUJsoow0kR1eWu', 'Martha', 'female', '1997-07-13', 'https://xsgames.co/randomusers/assets/avatars/female/29.jpg'],
        ['grace', '$2b$12$0y8aGqJ2pgojq0KYkdq.c.Bc7W2LoyWJWWlDblpWCMqJZ99Dl53gK', 'Grace', 'female', '1993-05-07', 'https://xsgames.co/randomusers/assets/avatars/female/30.jpg']
        ];

        
      for (const user of dummyUsers) {
        await pool.query(
          'INSERT INTO users (username, password_hash, name, gender, birthday, profile_picture) VALUES (?, ?, ?, ?, ?, ?)',
          user
        );
        console.log(`✅ Nutzer "${user[0]}" eingefügt`);
      }
    } else {
      console.log('✅ Es existieren bereits Benutzer in der Datenbank. Keine Dummy-Daten hinzugefügt.');
    }

  } catch (error) {
    console.error('❌ Fehler bei DB-Initialisierung:', error);
    process.exit(1);
  }
}

// Beim Importen: Initialisiere direkt
initializeDatabase();

// Den Pool exportieren, damit du db.query(...) wie gewohnt nutzen kannst
module.exports = {
  query: (...args) => pool.query(...args),
  getConnection: () => pool.getConnection()
};
