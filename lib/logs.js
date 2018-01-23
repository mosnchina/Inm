'use strict';
const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const cliSpinners = require('cli-spinners');


class logs {
    constructor(text) {
        this.options = {
            text: text ? text : "",
            color: 'white',
            stream: process.stderr
        };

        const sp = this.options.spinner;
        this.spinner = typeof sp === 'object' ? sp : (process.platform === 'win32' ? cliSpinners.line : (cliSpinners[sp] || cliSpinners.dots));

        if (this.spinner.frames === undefined) {
            throw new Error('Spinner must define `frames`');
        }

        this.text = this.options.text;
        this.color = this.options.color;
        this.interval = this.options.interval || this.spinner.interval || 100;
        this.stream = this.options.stream;
        this.id = null;
        this.frameIndex = 0;
        this.enabled = typeof this.options.enabled === 'boolean' ? this.options.enabled : ((this.stream && this.stream.isTTY) && !process.env.CI);
    }
    frame() {
        const frames = this.spinner.frames;
        let frame = frames[this.frameIndex];

        if (this.color) {
            frame = frame;
        }

        this.frameIndex = ++this.frameIndex % frames.length;

        return chalk[this.color](frame + ' ' + this.text);
    }
    clear() {
        if (!this.enabled) {
            return this;
        }

        this.stream.clearLine();
        this.stream.cursorTo(0);

        return this;
    }
    render() {
        this.clear();
        this.stream.write(this.frame());

        return this;
    }
    start(text) {
        if (text) {
            this.text = text;
        }
        this.color = "bgMagenta";
        if (!this.enabled || this.id) {
            return this;
        }
        cliCursor.hide(this.stream);
        this.render();
        this.id = setInterval(this.render.bind(this), this.interval);
        return this;
    }
    stop() {
        if (!this.enabled) {
            return this;
        }
        clearInterval(this.id);
        this.id = null;
        this.frameIndex = 0;
        this.clear();
        cliCursor.show(this.stream);
        return this;
    }
    succeed(text) {
        this.color = "green";
        return this.stopAndPersist({
            symbol: "√",
            text
        });
    }
    fail(text) {
        this.color = "red";
        return this.stopAndPersist({
            symbol: "×",
            text
        });
    }
    warn(text) {
        this.color = "yellow";
        return this.stopAndPersist({
            symbol: "?",
            text
        });
    }
    info(text) {
        this.color = "white";
        return this.stopAndPersist({
            symbol: "▷",
            text
        });
    }
    // text(text) {
    //     this.color = "white";
    //     return this.stopAndPersist({
    //         symbol: "◎",
    //         text
    //     });
    // }
    stopAndPersist(options) {
        if (typeof options === 'string') {
            options = {
                symbol: options
            };
        }
        options = options || {};
        this.stop();
        this.stream.write(chalk[this.color](`${options.symbol || ' '} ${options.text || this.text}\n`));
        return this;
    }
}

module.exports = function (opts) {
    return new logs(opts);
};