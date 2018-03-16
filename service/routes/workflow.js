
const auth = require('../auth')
const router = require('express-promise-router')()

router.use(auth.authenticate())

const authz = () => auth.authorize({ type: 'workflow' })

router.post('/', authz(), function(req, res) {
    return res.json({})
})

router.delete('/:id', authz(), function(req, res) {
    return res.json({})
})

module.exports = router
