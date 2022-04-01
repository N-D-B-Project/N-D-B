import * as Erela from "erela.js";
import * as Discord from "discord.js";

export default Erela.Structure.extend("Player", (Player) => 
  class BasePlayer extends Player {

    public LastSong: Array<Erela.Track>;
		public SongMessage: string;
		public PlayerMessage: string;
		public PlayerAuthor: string;
		public isSlash: boolean;
		public SlashInteraction: Discord.CommandInteraction;
		
    constructor(args: any) {
      super(args);
			this.LastSong = [];
			this.SongMessage;
			this.PlayerMessage;
			this.PlayerAuthor;
			this.isSlash;
			this.SlashInteraction;
    }

    AddLastSong(track: Erela.Track) {
      this.LastSong.push(track);
      return this;
    }

		SetCurrentSongMessage(message: Discord.Message) {
			this.SongMessage = message.id
			return this;
		}

		SetPlayerMessage(message: Discord.Message) {
			this.PlayerMessage = message.id;
			return this;
		}

		SetPlayerAuthor(msgint: Discord.Message | Discord.CommandInteraction) {
			const message = msgint as Discord.Message;
			const interaction = msgint as Discord.CommandInteraction;
			if(this.isSlash) {
				this.PlayerAuthor = interaction.user.id;
			} else {
				this.PlayerAuthor = message.author.id
			}
			
			return this;
		}

		SetIsSlash(isSlash: boolean, interaction?: Discord.CommandInteraction) {
			this.isSlash = isSlash;
			this.SlashInteraction = interaction;
			return this;
		}
  }
)
