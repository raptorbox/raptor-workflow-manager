const l = module.exports

const apiName = 'workflow'

const Raptor = require('raptor-sdk')
const Promise = require('bluebird')
const config = require(process.env.TESTCONFIG || `../config/${apiName}.json`)

let r
const instances = []

l.before = function() {
    return require('../index').start().then(() => {
        return l.getRaptor()
    })
}

l.after = function() {
    return require('../index').stop().then(() => {
        if(r) {
            return r.getClient().disconnect()
                .then(() => {
                    r = null
                    return Promise.resolve()
                })
        }
        return Promise.resolve()
    }).then(Promise.all(instances)
        .each((i) => i.getClient().disconnect())
        .then(() => {
            instances.length = 0
            return Promise.resolve()
        })
    )
}

l.randomName = (prefix) => {
    prefix = prefix || ''
    const rnd = Math.round(Math.random() * Date.now())
    return `test_${prefix}_${rnd}`
}

l.getRaptor = () => {
    if(r) return Promise.resolve(r)
    r =  new Raptor(config.raptor)
    return r.Auth().login()
        .then(() => Promise.resolve(r))
}

l.newUser = (username) => {
    username = username || l.randomName('user')
    const u = new Raptor.models.User()
    u.username = username
    u.password = 'passwd_' + u.username
    u.email = u.username + '@test.raptor.local'
    u.roles = ['user']
    return u
}

l.createUserInstance = (roles) => {
    return l.getRaptor()
        .then((r) => {
            const u = l.newUser()
            u.roles = roles ? roles : u.roles
            return r.Admin().User().create(u)
                .then(() => {
                    const r2 = new Raptor(Object.assign({}, config.sdk, {
                        username: u.username,
                        password: u.password,
                    }))
                    instances.push(r2)
                    return r2.Auth().login()
                        .then(() => Promise.resolve(r2))
                })
        })
}

l.createAdminInstance = () => {
    return l.createUserInstance(['admin'])
}
