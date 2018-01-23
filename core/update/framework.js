//工程配置
const _version = require('../../lib/version');

//执行脚本
const _exec = require('../../lib/exec');

//提示
const logs = require('../../lib/logs');

//语言
const language = require('../config/get').language();


module.exports = async() => {
    //当前模块信息
    let modelInfo = require('../../package');
    logs(language.update.framework.current + modelInfo.version).info();
    //检查版本
    let _checkVersionLoading = logs(language.update.framework.check).start();
    let onlineVersion = await _version(modelInfo.name);
    //不是最新版本
    if (onlineVersion != modelInfo.version) {
        _checkVersionLoading.succeed(language.update.framework.last  + onlineVersion);
        let _updateVersionLoading = logs(language.update.framework.start).start();
        //执行更新命令
        let cmdRq = await _exec("npm update " + modelInfo.name);
        if (cmdRq.error) {
            //失败
            _updateVersionLoading.fail(language.update.framework.error + cmdRq.error);
        } else {
            //成功
            _updateVersionLoading.succeed(language.update.framework.success);
        }
    } else {
        //最新版本
        _checkVersionLoading.succeed(language.update.framework.new);
    }
}