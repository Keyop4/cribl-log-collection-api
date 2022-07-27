const SQLite3 = require('sqlite3').verbose();
//connect to sqlite db and create a table if necessarry
const db = new SQLite3.Database(__dirname+'/logs.db', (err) => {
    if (err) {
      console.log("Error Occurred - " + err.message);
      throw err;
    }
    else {
      console.log("Database Connected")
      db.run(`CREATE TABLE log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event text NOT NULL,
        file text NOT NULL,
        created_at DATETIME DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')) NOT NULL
      )`,
      (err) => {
          if (err) {
            console.log("Table already created")
          }
          else{
            console.log("Table created, inserting records")
              var insert = 'INSERT INTO log (event, file) VALUES (?,?)'
              db.run(insert, ["Random event text 1","file1.txt"])
              db.run(insert, ["Random event text 2","file1.txt"])
              db.run(insert, ["Random event text 1","file2.txt"])
              db.run(insert, ["Random event text 2","file2.txt"])
          }
      });  
    }
  })
module.exports = db