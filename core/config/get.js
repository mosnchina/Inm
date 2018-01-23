const config = require('./config');





module.exports.language = () => {
    if (config.language == "zh") {
        return require('./language/zh.json')
    } else {
        return require('./language/en.json')
    }
}

module.exports.config = () => {
    return config;
}