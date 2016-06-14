var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./typings/tsd.d.ts" />
var EventEmmitter2 = require("eventemitter2");
var MinaraiClient = (function (_super) {
    __extends(MinaraiClient, _super);
    function MinaraiClient(options) {
        _super.call(this);
        this.socket = options.io.connect(options.socketIORootURL, options.socketIOOptions);
        this.clientId = options.clientId;
        this.clientName = options.clientName;
    }
    MinaraiClient.prototype.init = function () {
        var _this = this;
        this.socket.on('connect', function () {
            _this.emit("connect");
            _this.socket.emit('join-as-client', { clientId: _this.clientId });
        });
        this.socket.on('message', function (data) {
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
            console.log("on system-message");
            _this.emit('system-message', data);
        });
    };
    MinaraiClient.prototype.send = function (utter) {
        // TODO プロトコルを合わせる
        this.socket.emit('message', { utterance: utter });
    };
    return MinaraiClient;
})(EventEmmitter2.EventEmitter2);
exports.MinaraiClient = MinaraiClient;
