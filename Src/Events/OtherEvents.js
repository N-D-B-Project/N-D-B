const BaseEvent = require("../Utils/Structures/BaseEvent");
const Discord = require("discord.js");
const Logger = require("../Utils/Tools/Logger");

module.exports = class ReadyEvent extends BaseEvent {
  constructor(...args) {
    super(...args, {
        name: "ready",
    });
  }
  async run(client) {
    client
        .on("raw", (d) => client.music.updateVoiceState(d))
        .music.init(client.user.id)


    // process
    //     .on('unhandledRejection', (reason, promise) => {
    //         Logger.proc('=== unhandled Rejection ==='.toUpperCase());
    //         Logger.proc('Promise: ', promise , 'Reason: ', reason.stack ? reason.stack : reason);
    //         Logger.proc('=== unhandled Rejection ==='.toUpperCase());
    //     })
    //     .on("uncaughtException", (err, origin) => {
    //         Logger.proc('=== uncaught Exception ==='.toUpperCase());
    //         Logger.proc('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    //         Logger.proc('=== uncaught Exception ==='.toUpperCase());
    //     })
    //         .on('uncaughtExceptionMonitor', (err, origin) => {
    //             Logger.proc('=== uncaught Exception Monitor ==='.toUpperCase());
    //             Logger.proc('Origin: ', origin, 'Exception: ', err.stack ? err.stack : err)
    //             Logger.proc('=== uncaught Exception Monitor ==='.toUpperCase());
    //     })
    //         .on('beforeExit', (code) => {
    //             Logger.proc('=== before Exit ==='.toUpperCase());
    //             Logger.proc('Code: ', code);
    //             Logger.proc('=== before Exit ==='.toUpperCase());
    //     })
    //         .on('exit', (code) => {
    //             Logger.proc('=== exit ==='.toUpperCase());
    //             Logger.proc('Code: ', code);
    //             Logger.proc('=== exit ==='.toUpperCase());
    //     })
    //         .on('multipleResolves', (type, promise, reason) => {
    //             Logger.proc('=== multiple Resolves ==='.toUpperCase());
    //             Logger.proc(type, promise, reason);
    //             Logger.proc('=== multiple Resolves ==='.toUpperCase());
    //     })
    //         .on('warning', (warning) => {
    //           Logger.proc('=== warning ==='.toUpperCase());
    //           Logger.proc(warning.name)
    //           Logger.proc(warning.message);
    //           Logger.proc(warning.stack);
    //           Logger.proc('=== warning ==='.toUpperCase());
    //         })
  }
}