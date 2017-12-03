
const log = require('./logger')

module.exports = function(req, res, next) {

    if (!req.query.nonce) {
        return next()
    }

    log.debug('[nonce] Got %s', req.query.nonce)
    next(new Error('Invalid nonce'))
}
