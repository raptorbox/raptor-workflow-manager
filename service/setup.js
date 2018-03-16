
const logger = require('./logger')
const config = require('./config')

module.exports = () => {
    logger.info('Initializing raptor client')
    return require('./raptor').initialize(config.raptor)
}
