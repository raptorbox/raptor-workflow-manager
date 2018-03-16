
const Raptor = require('raptor-sdk')

const l = module.exports

let r

l.client = () => r

l.initialize = (cfg) => {
    r = new Raptor(cfg)
    return r.Auth().login().then(() => {
        return r.Admin().Token().list()
            .then((tokens) => {
                tokens = tokens ? tokens.getContent().filter((t) => t.name === cfg.tokenName) : []
                if(tokens) {
                    return Promise.resolve(tokens[0])
                }
                return r.Admin().Token().create({
                    name: cfg.tokenName,
                    expires: 0,
                })
            })
    }).then((token) => {
        cfg.token = token
        const cfg = r.getConfig()
        cfg.token = token.token
        cfg.username = cfg.password = null
        r.setConfig(cfg)
        return r.Auth().login()
    })
}
