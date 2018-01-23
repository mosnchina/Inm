const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async(cmd) => {
    var rq = {
        stdout: "",
        stderr: ""
    }
    try {
        rq = await exec(cmd);
    } catch (error) {
        rq.stderr = error.toString();
    }
    return {
        out: rq.stdout,
        error: rq.stderr
    }
}