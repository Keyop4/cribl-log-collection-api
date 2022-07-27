const db = require('./database.js');
const lineByLine = require('n-readlines');

function getLogs(requestQuery){
    const {file, keyword, limit} = requestQuery
    let keywordSearch = "";
    //dynamically create the wildcard search of the event column 
    if(typeof keyword==='string'){
        keywordSearch = `AND event LIKE "%${keyword}%"`
    }
    else if(Array.isArray(keyword)){
        keyword.forEach(item => keywordSearch = keywordSearch + `AND event LIKE "%${item}%" `)
    }
    const sql = `SELECT * FROM log WHERE file = "${file}" ${keywordSearch} ORDER BY ROWID DESC LIMIT ${limit || 10}`
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    })    
}

function readLogFile(requestQuery){
    const {file} = requestQuery
    const liner = new lineByLine(process.env.FILE_DIRECTORY+file); 
    let line;   
    
    while (line = liner.next()) {
        trimmedLine = line.toString('ascii').trim();
        insertLogEvent(trimmedLine,file);
    }

}

function insertLogEvent(event, fileName){
    db.run(`INSERT INTO log (event, file) VALUES ("${event}","${fileName}")`)
}

module.exports = {
    getLogs,
    readLogFile
}