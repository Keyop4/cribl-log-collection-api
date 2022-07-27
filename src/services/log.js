const db = require('./database.js');
const lineByLine = require('n-readlines');

//This function finds a file in a given directory, reads the file line by line,
//and ultimately calls another function to insert each line into the log table
function readLogFile(requestQuery){
    const {file} = requestQuery
    const liner = new lineByLine(process.env.FILE_DIRECTORY+file); 
    let line;   
    
    while (line = liner.next()) {
        trimmedLine = line.toString('ascii').trim();
        insertLogEvent(trimmedLine,file);
    }

}

//This function inserts a record into the log table
function insertLogEvent(event, fileName){
    db.run(`INSERT INTO log (event, file) VALUES ("${event}","${fileName}")`)
}

//This function queries the db and returns the appropriate
//records based on the request query parameters
function getLogs(requestQuery){
    const {file, keyword, limit} = requestQuery
    let keywordSearch = "";

    //dynamically create the keyword search of the event column
    //it is possible that the incoming request has an array of keywords,
    //which are processed by the else if block
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

module.exports = {
    readLogFile,
    getLogs,
    insertLogEvent
}
