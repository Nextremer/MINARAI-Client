var black = '\u001b[30m';
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var blue = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan = '\u001b[36m';
var white = '\u001b[37m';
var reset = '\u001b[0m';
var Logger = (function () {
    function Logger() {
        this.isSetup = false;
    }
    Logger.prototype.set = function (options) {
        this.debugMode = options.debug;
        this.silentMode = (options.silent == undefined) ? true : options.silent;
        this.isSetup = true;
    };
    Logger.prototype.debug = function (t) {
        if (!this.isSetup) {
            this.loggerWarning();
        }
        if (!this.debugMode) {
            return;
        }
        if (this.silentMode) {
            return;
        }
        console.log(cyan + "[DEBUG]" + reset + " " + t);
    };
    Logger.prototype.info = function (t) {
        if (!this.isSetup) {
            this.loggerWarning();
        }
        if (this.silentMode) {
            return;
        }
        console.log(green + "[INFO]" + reset + " " + t);
    };
    Logger.prototype.error = function (t) {
        if (!this.isSetup) {
            this.loggerWarning();
        }
        if (this.silentMode) {
            return;
        }
        console.error(red + "[ERROR]" + reset + " " + t);
    };
    Logger.prototype.warn = function (t) {
        if (!this.isSetup) {
            this.loggerWarning();
        }
        if (this.silentMode) {
            return;
        }
        console.error(yellow + "[WARN]" + reset + " " + t);
    };
    Logger.prototype.loggerWarning = function () {
        console.warn(yellow + "[WARN]" + reset + "logger has not been set up. call \"set()\" method");
    };
    return Logger;
})();
exports.logger = new Logger();
