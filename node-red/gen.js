
require('./raptor').generateToken()
    .then((t) => console.log('http://test1.workflow.localhost:1880/nonce?nonce=%s', t.token))
    .catch((e) => console.error(e))
