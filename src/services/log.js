const db = require('./database.js');
const lineByLine = require('n-readlines');

//This function finds a file in a given directory, reads the file line by line,
//and ultimately calls another function to insert each line into the log table
function readLogFile(requestQuery){
    const {file} = requestQuery
    const fileDirectory = process.env.FILE_DIRECTORY || '/var/log/'
    const liner = new lineByLine(fileDirectory+file); 
    let line;   
    
    while (line = liner.next()) {
        trimmedLine = line.toString('ascii').trim();
        insertLogEvent(trimmedLine,file);
    }

}

//This function inserts a record into the log table
function insertLogEvent(event, fileName){
    let insert = 'INSERT INTO log (event, file) VALUES (?,?)'
    db.run(insert,[event, fileName],(err) =>{
        if (err) {
            console.log(insertLogEvent)
            console.log(err);
        }
    })
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

    const sql = `SELECT * FROM log WHERE file = "${file}" ${keywordSearch} ORDER BY ROWID DESC LIMIT ${limit || process.env.LIMIT || 10}`
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
