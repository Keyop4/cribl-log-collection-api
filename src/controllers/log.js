const logService = require('../services/log.js');

function getLogs(req, res) {
    logService.getLogs(req.query).then((returnEvents) => {
        return res.status(200).json(returnEvents)
    }).catch((err) => {
        return res.status(500).json({
            message: err,
            error: err.message
       });
    });   
}

module.exports = {
    getLogs
}
