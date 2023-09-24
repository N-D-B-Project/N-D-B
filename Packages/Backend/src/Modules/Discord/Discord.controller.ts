import { Controller, Inject } from "@nestjs/common";
import { Services } from "src/@Types/Constants";
import { IDiscord } from "src/@Types/IServices";

@Controller("discord")
export class DiscordController {
  constructor(@Inject(Services.DISCORD) private readonly discord: IDiscord) {}
}
