const { Logger } = require("../../structures/Logger")

module.exports = {
    name: 'error',
    once: false,
    /**
     * Execute Event
     * @param {Error} err Error Found
     */
    async execute(err) {
        Logger.error(err);
    }
}