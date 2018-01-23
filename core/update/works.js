//提示
const logs = require('../../lib/logs');

//语言
const language = require('../config/get').language();



module.exports = async(callback) => {
    logs(language.update.works.success).succeed();
}