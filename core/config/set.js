const fs = require('fs');
const path = require('path');
const prompt = require('inquirer').prompt;
const table = require('table').table;
const chalk = require('chalk');
//提示
const logs = require('../../lib/logs');
//语言
const language = require('./get').language();




module.exports.language = () => {
    //当前支持工作套件
    var _config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
    //当前语言展示
    //logs(language.config.language.current+_config.language).info();
    // logs(language.config.language.list).info();
    //获取当前语言
    var _hasLanguage = fs.readdirSync(path.join(__dirname, 'language'));

    let _t_arr = [];
    _t_arr.push([language.config.language.listName, language.config.language.listChoose]);

    for (let i = 0; i < _hasLanguage.length; i++) {
        var _value = _hasLanguage[i].replace(".json", "");
        _t_arr.push([_value, _value == _config.language ? chalk["red"]("◈") : ""]);
    }

    let _t_config = {
        columns: {
            0: {
                alignment: 'center'
            },
            1: {
                alignment: 'center'
            }
        }
    };
   let _t_output = table(_t_arr,_t_config)
    logs(language.config.language.list + "\n" + _t_output).info();
    // console.log(showlist.toString());
    //询问
    prompt([{
        type: 'input',
        name: 'languageName',
        message: language.config.language.choose,
        validate(val) {
            if (val === '') {
                return language.config.language.empty
            } {
                if (_hasLanguage.indexOf(val + ".json") >= 0) {
                    return true
                } else {
                    return language.config.language.error
                }
            }
        }
    }]).then(({
        languageName
    }) => {
        _config.language = languageName;
        fs.writeFileSync(path.join(__dirname, 'config.json'), JSON.stringify(_config, null, 4))
        logs(language.config.language.success).succeed();
    })

}