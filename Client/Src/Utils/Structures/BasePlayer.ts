import { Structure, Track } from "erela.js";
import { CommandInteraction, Message, User } from "discord.js";

export default Structure.extend(
  "Player",
  (Player) =>
    class BasePlayer extends Player {
      public LastSong: Array<Track>;
      public SongMessage: string;
      public PlayerMessage: string;
      public PlayerAuthor: string;
      public isSlash: boolean;
      public SlashInteraction: CommandInteraction;

      constructor(args) {
        super(args);
        this.LastSong = [];
        this.SongMessage;
        this.PlayerMessage;
        this.PlayerAuthor;
        this.isSlash;
        this.SlashInteraction;
      }

      AddLastSong(track: Track) {
        this.LastSong.push(track);
        return this;
      }

      SetCurrentSongMessage(message: Message) {
        this.SongMessage = message.id;
        return this;
      }

      SetPlayerMessage(message: Message) {
        this.PlayerMessage = message.id;
        return this;
      }

      SetPlayerAuthor(user: User) {
        this.PlayerAuthor = user.id;

        return this;
      }

      SetIsSlash(isSlash: boolean, interaction?: CommandInteraction) {
        this.isSlash = isSlash;
        this.SlashInteraction = interaction;
        return this;
      }
    }
);
