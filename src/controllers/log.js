const logService = require('../services/log.js');

function getLogs(req, res) {
    try {
        logService.readLogFile(req.query)    
    }
    catch(err){
        return res.status(400).json({
            message: "Failed to read file",
            error: err.message
        });
    }

    logService.getLogs(req.query).then((rows) => {
        return res.status(200).json(rows)
    }).catch((err) => {
        return res.status(400).json({
            message: err,
            error: err.message
       });
    });
}

module.exports = {
    getLogs
}
