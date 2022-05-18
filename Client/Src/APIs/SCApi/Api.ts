import express, { Express } from "express";
import util from "node:util";
import { Config } from "~/Config";
import { Controller } from "~/Types";
import { Logger } from "@Utils/Tools";
import { HandleError, CheckAuth } from "./Middlewares";

export default class SCApi {
  private app: Express = express();
  private Config: typeof Config = Config;
  private Logger: Logger = new Logger();

  public constructor(public controllers: Controller[], private type: number) {
    this.app.use(express.json());
    this.app.use(HandleError(this.Logger));
    this.setupControllers();
  }

  public async start(): Promise<void> {
    switch (this.type) {
      case 1:
        var Port = this.Config.APIs.SCAPI.Port;
        break;
      case 2:
        var Port = this.Config.APIs.SCAPI.Port2;
        break;
    }
    let listen = util.promisify(this.app.listen.bind(this.app));
    await listen(Port);
    this.Logger.log(`SCApi ${this.type} is listening on port ${Port}`);
  }

  private setupControllers(): void {
    for (let controller of this.controllers) {
      if (controller.authToken) {
        controller.router.use(CheckAuth(controller.authToken));
      }
      controller.register();
      this.app.use(controller.path, controller.router);
    }
  }
}
