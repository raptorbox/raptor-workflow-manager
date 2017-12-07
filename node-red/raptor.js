
const Raptor = require('raptor-sdk')
const config = require('./config')

const client = () => {
    const r = new Raptor(config.raptor)
    return r.Auth().login()
        .then(() => Promise.resolve(r))
}

const generateToken = () => {
    return client().then((r) => r.Admin().Token().create({
        name: 'nonce',
        expires: (Date.now() + 2000000) / 1000,
    }))
}


module.exports = { client, generateToken }
