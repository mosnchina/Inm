var request = require('request');
var cheerio = require('cheerio');


module.exports = (name) => {
    return new Promise(resolve => {
        try {
            request('https://www.npmjs.com/package/' + name, function (error, response) {
                if (!error && response.statusCode == 200) {
                    var version = cheerio.load(response.body)('.sidebar .box strong').html();
                    resolve(version);
                } else {
                    resolve("");
                }
            })
        } catch (error) {
            resolve("");
        }
    });
}