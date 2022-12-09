import Moment from "moment";
import { Tools } from "@Utils/Tools";
import Chalk from "chalk";
import { inspect } from "util";

Chalk.level = 3;

export default class Logger {
  private clearLine = false;

  public set clear(condition: boolean) {
    this.clearLine = condition;
  }

  public get info() {
    return this.log;
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
      }
      // else {
      //   result =
      //     " ".repeat(Math.floor(length / 2 - 1)) +
      //     department +
      //     " ".repeat(Math.floor(length / 2 - 2));
      // }
    }

    return Chalk.white(result);
  }

  private universalLog(type: string, department: string, ...content: any) {
    if (this.clearLine && process.stdout.isTTY) {
      process.stdout.clearLine(0) && process.stdout.cursorTo(0);
    } else {
      process.stdout.write("\n");
    }

    process.stdout.write(
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
          .map((c: any) => (typeof c !== "string" ? inspect(c) : c))
          .join(" ")
    );
  }

  public log(department = this.defaultDepartment, ...content: any) {
    this.universalLog(Chalk.black.bgBlue(" INFO     "), department, ...content);
  }

  public error(department = this.defaultDepartment, ...content: any) {
    this.universalLog(Chalk.black.bgRed(" ERROR    "), department, ...content);
  }

  public warn(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.black.bgYellow(" WARN     "),
      department,
      ...content
    );
  }

  public success(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.black.bgGreen(" SUCCESS  "),
      department,
      ...content
    );
  }

  public critical(department = this.defaultDepartment, ...content: any) {
    this.universalLog(Chalk.black.bgRed(" CRITICAL "), department, ...content);
  }

  public debug(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.black.bgGreen(" DEBUG    "),
      department,
      ...content
    );
  }

  public database(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.rgb(77, 179, 61).bgBlack(" DATABASE "),
      department,
      ...content
    );
  }

  public command(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.rgb(95, 72, 169).bgGreen(" COMMANDS "),
      department,
      ...content
    );
  }

  public event(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.black.bgRgb(169, 147, 72)(" EVENTS   "),
      department,
      ...content
    );
  }

  public music(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.rgb(101, 174, 246).bgGreen(" MUSIC    "),
      department,
      ...content
    );
  }

  public process(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.rgb(211, 250, 103).bgGray(" PROCESS  "),
      department,
      ...content
    );
  }

  public ready(department = this.defaultDepartment, ...content: any) {
    this.universalLog(
      Chalk.rgb(40, 247, 80).bgGray(" READY    "),
      department,
      ...content
    );
  }
}
