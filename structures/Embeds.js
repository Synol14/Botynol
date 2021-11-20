const { getEmbed } = require("./Utils");

module.exports = {
    NO_USER_PERM: getEmbed("🛑 You don't have permission !", process.env.RED),
    NO_BOT_PERM: (permission = '', option = '') => { return getEmbed(`🙁 I don't have ${permission} permission ${option}!`, process.env.RED) },
    USER_NO_IN_CHANNEL: getEmbed("🔊 You are not in voice channel !", process.env.RED),
}