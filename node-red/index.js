
const http = require('http')
const express = require('express')
const RED = require('node-red')

const config = require('./config')
const log = require('./logger')
const nonce = require('./nonce')

let server

const start = () => {

    log.level = process.env.LOG_LEVEL || config.logLevel || 'warn'

    // Create an Express app
    const app = express()

    // Add a simple route for static content served from 'public'
    app.use('/',express.static('public'))

    // Create a server
    server = http.createServer(app)

    // Create the settings object - see default settings.js file for other options
    const settings = require('./settings')

    // Initialise the runtime with a server and settings
    RED.init(server, settings)

    // app.use(nonce.middleware)

    // Serve the editor UI from /
    app.use(settings.httpAdminRoot || '/', RED.httpAdmin)
    // Serve the http nodes UI from /api
    app.use(settings.httpNodeRoot || '/api', RED.httpNode)

    const passport = require('passport')
    const CustomStrategy = require('passport-custom')

    app.use(passport.initialize())
    passport.use('nonce', new CustomStrategy(nonce.strategy))

    passport.serializeUser(function(user, done) {
        done(null, JSON.stringify(user))
    })

    passport.deserializeUser(function(user, done) {
        done(null, JSON.parse(user))
    })

    app.get('/nonce',
        passport.authenticate('nonce', { failureRedirect: '/fail' }),
        (req, res) => res.redirect('/?access_token=' + req.user.tokens.accessToken)
    )

    app.use(function(err, req, res, next) {

        log.error('Error: %s', err.message)
        log.debug(err)

        if (err.code) {
            return res.status(err.code).send(err.text || err.message)
        }

        res.status(500).send('Internal Server Error')
    })

    return new Promise(function(resolve, reject) {
        server.listen(config.listen, function(err) {
            if(err) reject(err)
            resolve()
        })
    }).then(() => RED.start())
}

const stop = () => {
    return RED.stop()
        .then(() => {
            return new Promise(function(resolve, reject) {
                server.close(function(err) {
                    if (err) reject(err)
                    server = null
                    resolve()
                })
            })
        })
}

module.exports = {start, stop}
