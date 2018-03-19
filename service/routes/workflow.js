
const auth = require('../auth')
const router = require('express-promise-router')()
const redzilla = new (require('../redzilla'))()

router.use(auth.authenticate())

const authz = () => auth.authorize({ type: 'workflow' })

/**
 * Create an instance
 */
router.post('/:id', authz(), function(req, res) {
    res.json(redzilla.create(req.params.id))
})

/**
 * Drop an instance
 */
router.delete('/:id', authz(), function(req, res) {
    res.json(redzilla.delete(req.params.id))
})

module.exports = router
