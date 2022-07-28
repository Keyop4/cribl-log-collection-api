# cribl-log-collection-api
Author: Verne Hudson
Email: vhudson@rogers.com

# Requirements: 
Node.js, npm, Postman or similar tool

# Installation:
1. In a terminal, navigate to the cribl-log-collection-api folder
2. npm install
3. npm start
This should get the API running

# Details:
This API has only 1 route: `/logs`, and it takes 3 query parameters
1. file: the name of the file to be opened and read
2. keyword: for text/keyword filtering of events.  More than 1 keyword can be sent
3. limit: to limit the number of events selected
The example request `http://localhost:5000/logs?file=file1.txt&keyword=hustle&limit=4` will open the log file `file1.txt`, find events with the keyword `hustle`, and return the last 4 of those events in JSON format.

The API defaults to port 5000, and file folder `/var/log/`
To change the node environment and port from where the API runs, and the directory containing the file to be opened and read, create an .env file in the cribl-log-collection-api folder and add the appropriate values for NODE_ENV, PORT, and FILE_DIRECTORY

# Automated Tests:
1. Open a second terminal, navigate to the cribl-log-collection-api folder
2. npm test
The automated tests should run

