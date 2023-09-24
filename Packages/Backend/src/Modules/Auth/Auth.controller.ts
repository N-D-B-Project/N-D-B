import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  UseGuards
} from "@nestjs/common";
import { ApiForbiddenResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { HttpStatusCode } from "axios";
import { Routes, isDebug } from "src/@Types/Constants";
import { AuthUser } from "src/Utils/Decorators";
import { AuthenticatedGuard, DiscordGuard } from "src/Utils/Guards";

@ApiTags("Authentication Controller")
@Controller(Routes.AUTH)
export class AuthController {
  @ApiResponse({
    status: HttpStatusCode.Created,
    description: "Login the user, Creating or Updating his data in database"
  })
  @ApiForbiddenResponse({
    status: HttpStatusCode.Forbidden,
    description: "An error ocurred when login the user"
  })
  @Get("login")
  @UseGuards(DiscordGuard)
  login() {}

  @Get("redirect")
  @UseGuards(DiscordGuard)
  @HttpCode(HttpStatus.OK)
  @Redirect(
    isDebug
      ? "http://localhost:4400/api/auth/status"
      : "http://localhost:3000/home"
  )
  redirect() {}

  @Get("status")
  @UseGuards(AuthenticatedGuard)
  status(@AuthUser() user) {
    return user;
  }

  @Post("logout")
  logout() {}
}
