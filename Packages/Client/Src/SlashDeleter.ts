/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";

import { REST, Routes } from "discord.js";
import { Config } from "./Config/Config";

const rest = new REST({ version: "10" }).setToken(process.env.Token);

enum DeleteModeOptions {
  Test = "Test",
  Guild = "Guild",
  Global = "Global"
}

enum DeleteCommandType {
  All = "All",
  Only = "Only"
}

var deleteMode = "Guild";
const deleteCommand = DeleteCommandType.All;

if (deleteMode === "Test") {
  if (deleteCommand === DeleteCommandType.All) {
    rest
      .put(
        Routes.applicationGuildCommands(Config.Client.ID, Config.TestGuild.ID),
        { body: [] }
      )
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);
  } else if (deleteCommand === DeleteCommandType.Only) {
    const CommandID = "";
    rest
      .delete(
        Routes.applicationGuildCommand(
          Config.Client.ID,
          Config.TestGuild.ID,
          CommandID
        )
      )
      .then(() => console.log("Successfully deleted guild command"))
      .catch(console.error);
  }
}

if (deleteMode === "Guild") {
  if (deleteCommand === DeleteCommandType.All) {
    rest
      .put(
        Routes.applicationGuildCommands(
          Config.Client.ID,
          Config.NDCommunity.ID
        ),
        { body: [] }
      )
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);
  } else if (deleteCommand === DeleteCommandType.Only) {
    const CommandID = "";
    rest
      .delete(
        Routes.applicationGuildCommand(
          Config.Client.ID,
          Config.NDCommunity.ID,
          CommandID
        )
      )
      .then(() => console.log("Successfully deleted guild command"))
      .catch(console.error);
  }
}

if (deleteMode === "Global") {
  if (deleteCommand === DeleteCommandType.All) {
    rest
      .put(Routes.applicationCommands(Config.Client.ID), { body: [] })
      .then(() => console.log("Successfully deleted all application commands."))
      .catch(console.error);
  } else if (deleteCommand === DeleteCommandType.Only) {
    const CommandID = "";
    rest
      .delete(Routes.applicationCommand(Config.Client.ID, CommandID))
      .then(() => console.log("Successfully deleted application command"))
      .catch(console.error);
  }
}
