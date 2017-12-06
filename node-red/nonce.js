
const log = require('./logger')
const config = require('./config')
const request = require('request-promise')
const Raptor = require('raptor-sdk')
const Tokens = require('node-red/red/api/auth/tokens')

const check = (req) => {

    if (!req.query.nonce) {
        return Promise.resolve(null)
    }

    const raptor = new Raptor({
        url: config.raptor.url,
        token: req.query.nonce
    })

    return raptor.Auth().login().then(() => {
        const u = raptor.Auth().getUser()
        log.debug('[nonce] Valid nonce for %s', u.username)
        return Promise.resolve(u)
    }).catch((err) => {
        const e = new Error(err)
        e.code = 401
        e.text = 'Invalid nonce'
        return Promise.reject(e)
    })

}

const middleware = function(req, res, next) {
    return check(req)
        .then((u) => {
            req.raptorUser = u
            next()
        })
        .catch((err) => next(err))
}

const strategy = (req, callback) => {
    check(req).then((u) => {
        req.raptorUser = u
        const user = { username: u.username, permissions: ['*'] }
        Tokens.create(user.username,'node-red-editor', user.permissions).then(function(tokens) {
            user.tokens = tokens            
            callback(null, user)
        })
    }).catch((err) => callback(err, null))
}

module.exports = { middleware, strategy }
