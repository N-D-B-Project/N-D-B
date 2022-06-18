import * as Discord from "discord.js";
declare module "discord.js" {
  interface BaseApplicationCommandData {
    ephemeral: boolean;
  }
}

import * as Erela from "erela.js";
declare module "erela.js" {
  interface Player {
    LastSong: Array<Erela.Track>;
    AddLastSong(track: Erela.Track);

    SongMessage: string;
    SetCurrentSongMessage(message: Discord.Message);

    PlayerMessage: string;
    SetPlayerMessage(message: Discord.Message);

    PlayerAuthor: string;
    SetPlayerAuthor(message: Discord.User);

    isSlash: boolean;
    SlashInteraction: Discord.CommandInteraction;
    SetIsSlash(isSlash: boolean, interaction?: Discord.CommandInteraction);
  }
}
