"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Query_1 = require("./Query");
const debug = require("debug");
const events_1 = require("events");
const MDNSUtils = require("./MDNSUtils");
const RemoteService_1 = require("./RemoteService");
const Constants_1 = require("./Constants");
const debugLog = debug("SpreadTheWord:Listener");
class Listener extends events_1.EventEmitter {
    constructor(server, options = {}) {
        super();
        this.remoteServices = [];
        this.onResponse = (res, referrer) => {
            const srvRecords = this.server.recordRegistry.findSRVsByType(this.typeName || Constants_1.WILDCARD);
            for (const srvRecord of srvRecords) {
                const name = MDNSUtils.parseDNSName(srvRecord.name).name;
                const remoteService = this.remoteServices.find(x => x.name === name);
                if (!remoteService) {
                    const addressRecords = this.server.recordRegistry.findAddressRecordsByHostname(srvRecord.data.target);
                    const txtRecord = this.server.recordRegistry.findOneTXTByName(srvRecord.name);
                    this.addRemoteService(srvRecord, txtRecord, addressRecords, res, referrer);
                }
            }
            for (const remoteService of this.remoteServices) {
                const srvRecord = srvRecords.find(x => {
                    return MDNSUtils.parseDNSName(x.name).name === remoteService.name;
                });
                if (!srvRecord)
                    this.removeRemoteService(remoteService.name, res, referrer);
            }
        };
        this.server = server;
        this.wildcard = !options.type;
        if (!this.wildcard) {
            this.typeName = MDNSUtils.serializeDNSName({
                name: options.name,
                subtypes: options.subtypes,
                type: options.type,
                protocol: options.protocol || "tcp",
                domain: Constants_1.TOP_LEVEL_DOMAIN
            });
            this.wildcard = false;
        }
    }
    async listen() {
        this.server.on("response", this.onResponse);
        const query = new Query_1.default({
            questions: [{
                    name: this.typeName || Constants_1.WILDCARD,
                    type: "PTR"
                }]
        });
        await this.server.transport.query(query);
    }
    destroy() {
        this.server.removeListener("response", this.onResponse);
    }
    addRemoteService(record, txtRecord, addressRecords, res, referrer) {
        const remoteService = new RemoteService_1.default(record, txtRecord, addressRecords);
        this.remoteServices.push(remoteService);
        debugLog("up", remoteService.name, remoteService.hostname, remoteService.port);
        this.emit("up", remoteService, res, referrer);
    }
    removeRemoteService(name, res, referrer) {
        const remoteService = this.remoteServices.find(x => x.name === name);
        if (!remoteService)
            return;
        this.remoteServices.splice(this.remoteServices.indexOf(remoteService), 1);
        debugLog("down", remoteService.name, remoteService.hostname, remoteService.port);
        this.emit("down", remoteService, res, referrer);
    }
}
exports.default = Listener;
