const fs = require('fs');
const readline = require('readline');

//This function reads the file line by line, adding each line
//to an array
async function readLogFile(file){
    const fileDirectory = process.env.FILE_DIRECTORY || '/var/log/'
    const fileStream = fs.createReadStream(fileDirectory+file);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    let logEvents = []
    for await (const line of rl) {
        logEvents.push(line);
    }
    return logEvents;    
}

//This function gets the array of events from readLogFile(), filters those events
//based on the request query parameters, and returns the filtered array of events
async function getLogs(requestQuery){
    const {file, keyword, limit} = requestQuery
    let logEvents = await readLogFile(file);
    logEvents.reverse();
    let eventsLimit = limit || process.env.LIMIT || 10;
    let returnEvents = [];    

    //filter the events based on 1 keyword
    if((typeof keyword==='string') && keyword.length > 0){
        for (let i=0; i < logEvents.length; i++){
            let logEvent = logEvents[i];
            if(logEvent.includes(keyword)){
                returnEvents.push(logEvent);
                if(returnEvents.length==eventsLimit){
                    break;
                } 
            } 
        }
    }
    //filter the events based on an array of keywords
    else if(Array.isArray(keyword)){
        for (let i=0; i < logEvents.length; i++){
            let logEvent = logEvents[i];
            let addEvent = true;
            for(const item of keyword){
                if(item.length > 0){
                    if(!logEvent.includes(item)){
                        addEvent = false;
                        break;
                    }
                } 
            }
            if(addEvent){
                returnEvents.push(logEvent);
                if(returnEvents.length==eventsLimit){
                    break;
                } 
            }            
        }
    }
    //no keyword filtering of the events
    else{
        for (let i=0; i < logEvents.length; i++){
            returnEvents.push(logEvents[i]);
            if(returnEvents.length==eventsLimit){
                break;
            } 
        } 
    }
    return returnEvents;
}

module.exports = {
    readLogFile,
    getLogs
}
