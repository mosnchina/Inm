var request = require('request');
var cheerio = require('cheerio');

module.exports = (name,callback) => {
    try {
        request('https://www.npmjs.com/package/' + name, function (error, response) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(response.body);
                callback($('.sidebar .box strong').html());
            }else{
                callback("")
            }   
        })
    } catch (error) {
        return ""
    }
}

