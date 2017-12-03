
const Promise = require('bluebird')
const Raptor = require('raptor-sdk')

const config = require('./config')
const log = require('./logger')
const raptor = new Raptor(config.raptor)

const cache = {
    values: {},
    get(key) {
        const v = this.values[key] ? this.values[key].val : null
        return Promise.resolve(v)
    },
    set(key, val, ttl = 3600) {

        if (this.values[key] && this.values[key].timeout) {
            clearTimeout(this.values[key].timeout)
        }

        let timeout = null
        if(ttl) {
            timeout = setTimeout(() => {
                if (this.values[key]) {
                    delete this.values[key]
                }
            }, ttl * 1000)
        }

        this.values[key] = { val, timeout, ttl }
        return Promise.resolve(val)
    }
}

module.exports = {
    type: 'credentials',
    users: function(username) {
        return raptor.Auth().login()
            .then(() => cache.get(username).then((c) => {

                if (!c) {
                    return Promise.resolve(null)
                }

                return Promise.resolve(c.user)
            }))
            .catch((e) => {

                log.error('User lookup failed: %s', e.message)
                log.debug(e)

                return Promise.resolve(null)
            })
    },
    authenticate: function(username, password) {
        return raptor.Auth().login().then(()=> {
            const r = new Raptor({
                username, password,
                url: raptor.getConfig().url
            })
            return r.Auth().login().then(() => {
                return cache.set(username, {
                    raptor: r,
                    user: {
                        username,
                        permissions: '*'
                    }
                }).then((c) => Promise.resolve(c.user))
            }).catch((e) => {
                log.error('User login failed: %s', e.message)
                log.debug(e)
                return Promise.resolve(null)
            })
        })
    },
    default: function() {
        return Promise.resolve({anonymous: true, permissions:''})
    }
}
