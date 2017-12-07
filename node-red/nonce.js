
const log = require('./logger')
const raptorClient = require('./raptor')
const Tokens = require('node-red/red/api/auth/tokens')

const check = (req) => {

    const token = req.query.nonce
    if (!token) {
        return Promise.resolve(null)
    }

    return raptorClient.checkToken({ token, remove: true }).catch((err) => {
        const e = new Error(err)
        e.code = 401
        e.text = 'Invalid nonce'
        return Promise.reject(e)
    })

}

const createAccessToken = (u) => {

    const perms = [
        ...new Set(u.roles
            .map((role) => role.permissions)
            .reduce((a, b) => a.push(...b) >= 0 && a, []))
    ]

    const permissions = []

    const hasPerm = (list) => {
        return list.filter((p) => perms.indexOf(p)).length > 0
    }

    if (hasPerm(['admin', 'admin_workflow', 'service'])) {
        permissions.push('*')
    }

    // 'flows.read', 'nodes.read', 'credentials.read', 'settings.read', 'library.read'

    if(hasPerm(['read_workflow'])) {
        permissions.push('read')
    }
    if(hasPerm(['write_workflow'])) {
        permissions.push('write')
    }

    const user = { username: u.username, permissions }
    return Tokens.create(user.username, 'node-red-editor', user.permissions).then(function(tokens) {
        user.tokens = tokens
        return Promise.resolve(user)
    })
}

const strategy = (req, callback) => {
    check(req).then((u) => {
        log.debug('[nonce] Valid nonce for %s', u.username)
        return createAccessToken(u).then((user) => callback(null, user))
    }).catch((err) => callback(err, null))
}

// const middleware = (req, res, next) => {
//     check(req).then((u) => {
//         if(u === null) {
//             return next()
//         }
//         createAccessToken(u).then((user) =>
//             res.redirect('/?access_token=' + user.tokens.accessToken)
//         )
//     }).catch((err) => next(err))
// }

module.exports = {
    strategy,
    // middleware,
}
