if (!String.prototype.splice)
  String.prototype.splice = function (i, r, s) {
    return this.slice(0, i) + s + this.slice(i + Math.abs(r));
  };

const chalk = require("chalk"),
  {
    blueBright,
    cyanBright,
    greenBright,
    grey,
    magenta,
    magentaBright,
    redBright,
    yellow,
  } = chalk,

  DBColor = chalk.rgb(77, 179, 61)
  MusicColor = chalk.rgb(101, 174, 246)
  ProcColor = chalk.rgb(211, 250, 103)
  EventColor = chalk.rgb(169, 147, 72)
  CommandColor = chalk.rgb(95, 72, 169)
  AppColor = chalk.rgb(67, 54, 205)
  token = process.env.DISCORD_TOKEN;

chalk.level = 1;

function pad(value, digits) {
  while (value.toString().length < digits) value = `0${value}`;
  return value;
}

function format(d) {
  return (
    pad(d.getDate(), 2) +
    "/" +
    pad(d.getMonth() + 1, 2) +
    "/" +
    d.getFullYear().toString().splice(0, 2, "") +
    " " +
    pad(d.getHours(), 2) +
    ":" +
    pad(d.getMinutes(), 2) +
    ":" +
    pad(d.getSeconds(), 2) +
    "." +
    pad(d.getMilliseconds(), 3)
  );
}

function typeName(type, color) {
  switch (type) {
    case "warn":
      return color ? yellow("WRN") : "WRN";
    case "error":
      return color ? redBright("ERR") : "ERR";
    case "debug":
      return color ? magenta("DBG") : "DBG";
    case "msg":
      return color ? magentaBright("MSG") : "MSG";
    case "cmd":
      return color ? cyanBright("CMD") : "CMD";
    case "ready":
      return color ? greenBright("RDY") : "RDY";
    case "dtb":
      return color ? DBColor("DTB") : "DTB";
    case "music":
      return color ? MusicColor("MSC") : "MSC";
    case "proc":
      return color ? ProcColor("PRO") : "PRO";
    case "event":
      return color ? EventColor("EVT") : "EVT";
    case "command":
      return color ? CommandColor("CMN") : "CMN";
    default:
      return color ? blueBright("LOG") : "LOG";
  }
}

class Logger {
  static log(content, options = {}) {
    if (typeof options === "string") options = { type: options };
    if (!options.type) options.type = "log";
    if (typeof content !== "string") {
      if (
        typeof content === "object" &&
        Object.prototype.toString.call(content).match(/\[object (.+)]/)[1] ===
          "Error"
      ) {
        content = content.stack;
        options.type = "error";
      } else content = require("util").inspect(content, { depth: 1 });
    }

    content = content
      .replace(new RegExp(process.env.PWD, "g"), "")
      .replace(new RegExp(token, "g"), "T0K3N");
    content.split("\n").forEach((sub) => {
      const date = `[${format(new Date(Date.now()))}]`,
        m = `${grey(date)}   ${typeName(options.type, true)}\t${sub}`;
      console.log(m);
    });
  }

  static error(...args) {
    this.log(...args, { type: "error" });
  }
  static warn(...args) {
    this.log(...args, { type: "warn" });
  }
  static debug(...args) {
    this.log(...args, { type: "debug" });
  }
  static cmd(...args) {
    this.log(...args, { type: "cmd" });
  }
  static ready(...args) {
    this.log(...args, { type: "ready" });
  }
  static msg(...args) {
    this.log(...args, { type: "msg" });
  }
  static dtb(...args) {
    this.log(...args, { type: "dtb" });
  }
  static music(...args) {
    this.log(...args, { type: "music" });
  }
  static command(...args) {
    this.log(...args, { type: "command" });
  }
  static event(...args) {
    this.log(...args, { type: "event" });
  }
  static proc(...args) {
    this.log(...args, { type: "proc" });
  }
}

module.exports = Logger;
