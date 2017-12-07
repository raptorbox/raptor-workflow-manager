
const Raptor = require('raptor-sdk')
const config = require('./config')

let instance

const service = () => {
    if (instance) return Promise.resolve(instance)
    return client().then((r) => {
        instance = r
        return Promise.resolve(instance)
    })
}

const client = (username, password) => {
    const cfg = Object.assign({}, config.raptor)
    if (username && password) {
        cfg.username = username
        cfg.password = password
    }
    const r = new Raptor(cfg)
    return r.Auth().login()
        .then(() => Promise.resolve(r))
}

const generateToken = ({username, password, ttl = 2500}) => {
    return client(username, password).then((r) => r.Admin().Token().create({
        name: 'nonce',
        expires: (Date.now() + config.tokenTTL || ttl) / 1000,
    }))
}

const checkToken = ({token, remove = true}) => {
    return service().then((r) => r.Admin().Token().check(token).then((u) => {
        let p = Promise.resolve()
        if (remove) {
            p = r.Admin().Token().delete(u.token.id)
        }
        return p.then(() => Promise.resolve(u))
    }))
}

module.exports = { client, generateToken, checkToken }
