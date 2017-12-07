
require('./raptor').generateToken({
    username: 'admin',
    password: 'admin',
    ttl: 10000
})
    .then((t) => console.log('http://test1.workflow.localhost:1880/nonce?nonce=%s', t.token))
    .catch((e) => console.error(e))
