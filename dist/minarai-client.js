var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./typings/tsd.d.ts" />
var EventEmmitter2 = require("eventemitter2");
var logger_1 = require("./logger");
var MinaraiClient = (function (_super) {
    __extends(MinaraiClient, _super);
    function MinaraiClient(options) {
        _super.call(this);
        logger_1.logger.set({ debug: options.debug, silent: options.silent });
        this.socket = options.io.connect(options.socketIORootURL, options.socketIOOptions);
        this.clientId = options.clientId;
        logger_1.logger.debug("new MINARAI CLIENT");
        logger_1.logger.debug("options = JSON.stringify(options)");
    }
    MinaraiClient.prototype.init = function () {
        var _this = this;
        this.socket.on('connect', function () {
            logger_1.logger.info("connected to socket.io server");
            _this.emit("connect");
            logger_1.logger.debug("trying to join as Minarai Client....");
            _this.socket.emit('join-as-client', { clientId: _this.clientId });
        });
        this.socket.on('message', function (data) {
            logger_1.logger.debug("recieved message");
            if (data.utterance) {
            }
            if (data.uiCommand) {
            }
            if (data.slots) {
            }
            // raw
            _this.emit('message', data);
        });
        this.socket.on('system-message', function (data) {
            logger_1.logger.debug("recieved system message");
            var type = data.type;
            if (type === "joined-as-client") {
                logger_1.logger.info("joined as minarai-client");
                _this.emit("joined");
            }
            _this.emit('system-message', data);
        });
    };
    MinaraiClient.prototype.send = function (utter) {
        // TODO プロトコルを合わせる
        var payload = {
            message: utter
        };
        logger_1.logger.debug("send : " + JSON.stringify(payload));
        this.socket.emit('message', payload);
    };
    MinaraiClient.prototype.sendSystemCommand = function (command, payload) {
        var message = { command: command, payload: payload };
        logger_1.logger.debug("send system command : command=\"" + command + "\", payload=\"" + JSON.stringify(payload) + "\"");
        this.socket.emit('system-command', { message: message });
    };
    return MinaraiClient;
})(EventEmmitter2.EventEmitter2);
exports.MinaraiClient = MinaraiClient;
