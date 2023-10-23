import { Tools } from "@/Utils/Tools";
import Chalk from "chalk";
import fs from "fs";
import Moment from "moment";
import { pid } from "process";
import { inspect } from "util";

Chalk.level = 3;
const logDir = "./Logs";

export default class Logger {
  private logFileName = `${pid}_${Date.now()}_latest.log`;
  private logStream: fs.WriteStream;
  private clearLine = false;

  public constructor() {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    this.logStream = fs.createWriteStream(`${logDir}/${this.logFileName}`, {
      flags: "a"
    });
  }

  public set clear(condition: boolean) {
    this.clearLine = condition;
  }

  public get info() {
    return this.log;
  }

  private transcript(type: string, department: string, ...content: unknown[]) {
    const logMessage = `${type} | ${Moment().format(
      Tools.getMomentFormat("calendar", "pt-BR")
    )} - ${this.prependDepartment(department)} ${content
      .map((c: unknown) => (typeof c !== "string" ? inspect(c) : c))
      .join(" ")}\n`;

    const previousLog = fs
      .readdirSync(logDir)
      .find(name => name.includes("_latest.log"));
    if (!previousLog.includes(pid.toString())) {
      fs.rename(
        `${logDir}/${previousLog}`,
        `${logDir}/${previousLog.replace("_latest", "")}`,
        err => {
          if (err) {
            console.error(
              "Error while rename previous log file: ",
              err.message
            );
          }
        }
      );
    }
    this.logStream.write(logMessage, err => {
      if (err) {
        console.error("Error while transcript to log file: ", err.message);
      }
    });
  }

  private get defaultDepartment() {
    return global.deleter?.shard?.ids
      ? "shard " + global.deleter.shard.ids
      : "manager";
  }

  private prependDepartment(department: string) {
    let result = department;

    if (department.length < 13) {
      const length = 12 - department.length,
        isEven = length % 2 !== 0;

      if (isEven) {
        result =
          " ".repeat(length / 2 - 1) + department + " ".repeat(length / 2 - 1);
      } else if (length === 1) {
        result = department + " ";
      } else {
        result =
          " ".repeat(Math.floor(length / 2 - 1)) +
          department +
          " ".repeat(Math.floor(length / 2 - 2));
      }
    }

    return Chalk.white(result);
  }

  private universalLog(
    type: string,
    department: string,
    ...content: unknown[]
  ) {
    if (this.clearLine && process.stdout.isTTY) {
      process.stdout.clearLine(0) && process.stdout.cursorTo(0);
    }

    console.log(
      type +
        " " +
        Chalk.white(" | ") +
        " " +
        Chalk.italic.dim(
          Moment().format(Tools.getMomentFormat("calendar", "pt-BR"))
        ) +
        " " +
        Chalk.cyan.bold(" - ") +
        " " +
        this.prependDepartment(department) +
        " " +
        Chalk.white(" ") +
        " " +
        content
          .map((c: unknown) => (typeof c !== "string" ? inspect(c) : c))
          .join(" ")
    );
  }

  public log(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(Chalk.black.bgBlue(" INFO     "), department, ...content);
    this.transcript(Chalk.black.bgBlue(" INFO     "), department, ...content);
  }

  public error(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(Chalk.black.bgRed(" ERROR    "), department, ...content);
    this.transcript(Chalk.black.bgRed(" ERROR    "), department, ...content);
  }

  public warn(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.black.bgYellow(" WARN     "),
      department,
      ...content
    );
    this.transcript(Chalk.black.bgYellow(" WARN     "), department, ...content);
  }

  public success(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.black.bgGreen(" SUCCESS  "),
      department,
      ...content
    );
    this.transcript(Chalk.black.bgGreen(" SUCCESS  "), department, ...content);
  }

  public critical(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(Chalk.black.bgRed(" CRITICAL "), department, ...content);
    this.transcript(Chalk.black.bgRed(" CRITICAL "), department, ...content);
  }

  public debug(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(Chalk.black.bgBlue(" DEBUG    "), department, ...content);
    this.transcript(Chalk.black.bgBlue(" DEBUG    "), department, ...content);
  }

  public database(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.rgb(77, 179, 61).bgBlack(" DATABASE "),
      department,
      ...content
    );
    this.transcript(
      Chalk.rgb(77, 179, 61).bgBlack(" DATABASE "),
      department,
      ...content
    );
  }

  public command(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.rgb(95, 72, 169).bgCyan(" COMMANDS "),
      department,
      ...content
    );
    this.transcript(
      Chalk.rgb(95, 72, 169).bgCyan(" COMMANDS "),
      department,
      ...content
    );
  }

  public event(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.black.bgRgb(169, 147, 72)(" EVENTS   "),
      department,
      ...content
    );
    this.transcript(
      Chalk.black.bgRgb(169, 147, 72)(" EVENTS   "),
      department,
      ...content
    );
  }

  public music(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.rgb(255, 105, 66).bgGreen(" MUSIC    "),
      department,
      ...content
    );
    this.transcript(
      Chalk.rgb(255, 105, 66).bgGreen(" MUSIC    "),
      department,
      ...content
    );
  }

  public process(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.rgb(211, 250, 103).bgGray(" PROCESS  "),
      department,
      ...content
    );
    this.transcript(
      Chalk.rgb(211, 250, 103).bgGray(" PROCESS  "),
      department,
      ...content
    );
  }

  public ready(department = this.defaultDepartment, ...content: unknown[]) {
    this.universalLog(
      Chalk.rgb(40, 247, 80).bgGray(" READY    "),
      department,
      ...content
    );
    this.transcript(
      Chalk.rgb(40, 247, 80).bgGray(" READY    "),
      department,
      ...content
    );
  }
}
