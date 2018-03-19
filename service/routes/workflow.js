
const auth = require('../auth')
const router = require('express-promise-router')()
const redzilla = new (require('../redzilla'))()
const logger = require('../logger')

router.use(auth.authenticate())

const authz = () => auth.authorize({ type: 'workflow' })

/**
 * List instances
 */
router.get('/', authz(), async function(req, res) {
    logger.debug('List instances')
    const resp = await redzilla.list()
    res.json(resp.data)
})

/**
 * Get an instance
 */
router.get('/:id', authz(), async function(req, res) {
    logger.debug('Get %s', req.params.id)
    const resp = await redzilla.get(req.params.id)
    res.json(resp.data)
})

/**
 * Create an instance
 */
router.post('/:id', authz(), async function(req, res) {
    logger.debug('Create %s', req.params.id)
    const resp = await redzilla.create(req.params.id)
    res.json(resp.data)
})

/**
 * Drop an instance
 */
router.delete('/:id', authz(), async function(req, res) {
    logger.debug('Drop %s', req.params.id)
    const resp = await redzilla.delete(req.params.id)
    res.json(resp.data)
})

/**
 * Start an instance
 */
router.post('/:id/start', authz(), async function(req, res) {
    logger.debug('Start %s', req.params.id)
    const resp = await redzilla.start(req.params.id, req.body)
    res.json(resp.data)
})

/**
 * Stop an instance
 */
router.post('/:id/stop', authz(), async function(req, res) {
    logger.debug('Stop %s', req.params.id)
    const resp = await redzilla.stop(req.params.id, req.body)
    res.json(resp.data)
})

/**
 * Restart an instance
 */
router.post('/:id/stop', authz(), function(req, res) {

    res.json((async () => {
        try {
            await redzilla.stop(req.params.id)
        } catch(ex) {
            logger.warn('Failed to stop: %s', ex.message)
        }
        await redzilla.start(req.params.id, req.body)
        return Promise.resolve()
    })())
})

module.exports = router
