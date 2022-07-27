const logService = require('@/services/log.js');
const db = require('@/services/database.js');

describe('log service', () =>{
    describe('getLogs function', () => {
        it('returns a record based on the search criteria', () => {
            logService.insertLogEvent('testable log event 1', 'testfile1.txt')
            const requestQuery = {
                "file": "testfile1.txt",
                "keyword": "testable",
                "limit": 1
              }
            return logService.getLogs(requestQuery).then(data => {
                expect(data).toMatchObject([{
                "event": 'testable log event 1',
                "file": 'testfile1.txt'
                }])
            })
        })
    })
})