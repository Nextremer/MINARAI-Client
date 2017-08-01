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
        this.io = options.io;
        this.clientId = options.clientId;
        this.socketIORootURL = options.socketIORootURL;
        this.socketIOOptions = options.socketIOOptions;
        this.lang = options.lang || 'ja';
        logger_1.logger.debug("new MINARAI CLIENT");
        logger_1.logger.debug("options = JSON.stringify(options)");
    }
    MinaraiClient.prototype.init = function (initOptions) {
        var _this = this;
        if (initOptions === void 0) { initOptions = {}; }
        this.socket = this.io.connect(this.socketIORootURL, this.socketIOOptions);
        this.socket.on('connect', function () {
            logger_1.logger.info("connected to socket.io server");
            _this.emit("connect");
            logger_1.logger.debug("trying to join as Minarai Client....");
            _this.socket.emit('join-as-client', { clientId: _this.clientId, extra: initOptions.joinOptions }, function (res) {
                _this.emit('join-failed', res);
            });
        });
        this.socket.on('minarai-error', function (e) {
            logger_1.logger.error("error on MinaraiClient : " + JSON.stringify(e));
            _this.emit('error', e);
        });
        this.socket.on('message', function (rcvData) {
            logger_1.logger.debug("recieved message");
            var recievedData = backwardCompatibilitySupport(rcvData);
            // raw
            _this.emit('message', _this.convertResponsePayload(recievedData));
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
        this.socket.on('disconnect', function () {
            logger_1.logger.info('disconnect to socket.io server');
            _this.emit('disconnect');
        });
    };
    MinaraiClient.prototype.convertResponsePayload = function (recievedData) {
        return recievedData;
    };
    MinaraiClient.prototype.convertRequestPayload = function (requestPayload) {
        return requestPayload;
    };
    MinaraiClient.prototype.send = function (utter, options) {
        options = options || {};
        var timestamp = new Date().getTime();
        var payload = {
            id: this.clientId + "-" + timestamp,
            head: {
                clientId: this.clientId,
                timestampUnixTime: timestamp,
                lang: options.lang || this.lang || 'ja',
            },
            body: {
                message: utter,
                extra: options.extra,
            }
        };
        logger_1.logger.debug("send : " + JSON.stringify(payload));
        this.socket.emit('message', this.convertRequestPayload(payload));
    };
    MinaraiClient.prototype.sendSystemCommand = function (command, payload) {
        var message = { command: command, payload: payload };
        logger_1.logger.debug("send system command : command=\"" + command + "\", payload=\"" + JSON.stringify(payload) + "\"");
        this.socket.emit('system-command', { message: message });
    };
    return MinaraiClient;
})(EventEmmitter2.EventEmitter2);
exports.MinaraiClient = MinaraiClient;
function backwardCompatibilitySupport(data) {
    // backwardCompatibility
    if (data.head && data.body) {
        return data;
    }
    else {
        logger_1.logger.warn("Minarai server seems to be older than v0.1.0. The response is corrected to new format. This backward compatibility support might not be done in the future. \ngiven data=" + JSON.stringify(data));
        return {
            head: {
                serializedContext: data.serializedContext
            },
            body: data,
        };
    }
}
