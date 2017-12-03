
const http = require('http')
const express = require('express')
const RED = require('node-red')

const log = require('./logger')

if (process.env.LOG_LEVEL) {
    log.level = process.env.LOG_LEVEL
}

// Create an Express app
const app = express()

// Add a simple route for static content served from 'public'
app.use('/',express.static('public'))

// Create a server
const server = http.createServer(app)

// Create the settings object - see default settings.js file for other options
const settings = require('./settings')

// Initialise the runtime with a server and settings
RED.init(server, settings)

app.use(require('./nonce'))

// Serve the editor UI from /
app.use(settings.httpAdminRoot || '/', RED.httpAdmin)

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot || '/api', RED.httpNode)

app.use(function(err, req, res, next) {

    log.error('Error: %s', err.message)
    log.debug(err)

    res.status(500).send('Internal Server Error')
})

server.listen(1880)

// Start the runtime
RED.start()
