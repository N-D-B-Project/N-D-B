import NDBClient from "@Client/NDBClient";
import {
  Message,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
} from "discord.js";
import { SearchResult, Player, Track } from "erela.js";
import { URLList } from "~/Config/URLList";
import { Emojis } from "~/Config/Emojis";

export default class AddSong {
  constructor(private client: NDBClient) {
    this.client = client;
  }

  public async Start(
    msgint: Message | CommandInteraction,
    args: Array<string> | CommandInteractionOptionResolver,
    isSlash: boolean
  ) {
    const message = msgint as Message;
    const interaction = msgint as CommandInteraction;
    switch (isSlash) {
      case false:
        this._Command(message, args as Array<string>);
        break;

      case true:
        this._Slash(interaction, args as CommandInteractionOptionResolver);
        break;
    }
  }

  private async _Command(message: Message, args: Array<string>) {
    const member = message.guild.members.cache.get(message.member.user.id);
    if (!member.voice.channel) {
      message.reply({ embeds: [await this.NoChannelEmbed(message)] });
      return;
    }
    if (!args.join(" ")) {
      message.reply({ embeds: [await this.NoArgsEmbed(message)] });
      return;
    }

    var Search = args.join(" ");
    var res: SearchResult;
    var player: Player = this.client.ErelaManager.players.get(message.guild.id);
    if (!player) {
      player = this.client.ErelaManager.create({
        guild: message.guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: message.channel.id,
        selfDeafen: this.client.Config.Music.Client.selfDeaf,
      });
      if (player.state !== "CONNECTED") {
        player.SetIsSlash(false);
        player.SetPlayerAuthor(message.author);
        player.connect();
        player.stop();
      }
    }

    if (this.client.Tools.isValidURL(Search)) {
      res = await player.search(Search, message.author);
    } else {
      res = await player.search(
        {
          query: Search,
        },
        message.author
      );
    }

    await this.LoadType(res, player, message, args, false);
  }

  private async _Slash(
    interaction: CommandInteraction,
    args: CommandInteractionOptionResolver
  ) {
    const member = interaction.guild.members.cache.get(
      interaction.member.user.id
    );
    if (!member.voice.channel) {
      await interaction.followUp({
        embeds: [await this.NoChannelEmbed(interaction)],
      });
      setTimeout(async () => {
        interaction.followUp({});
      }, 5000);
      return;
    }

    var Search = args.get("query").value as string;
    var res: SearchResult;
    var player: Player = this.client.ErelaManager.players.get(
      interaction.guild.id
    );
    if (!player) {
      player = this.client.ErelaManager.create({
        guild: interaction.guild.id,
        voiceChannel: member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: this.client.Config.Music.Client.selfDeaf,
      });
      if (player.state !== "CONNECTED") {
        player.SetIsSlash(true, interaction);
        player.SetPlayerAuthor(interaction.user);
        player.connect();
        player.stop();
      }
    }

    if (this.client.Tools.isValidURL(Search)) {
      res = await player.search(Search, member);
    } else {
      res = await player.search(
        {
          query: Search,
        },
        member
      );
    }

    await this.LoadType(res, player, interaction, args, true);
  }

  private async Playlist() {}

  private async LoadType(
    res: SearchResult,
    player: Player,
    msgint: Message | CommandInteraction,
    args: Array<string> | CommandInteractionOptionResolver,
    isSlash: boolean
  ) {
    const message = msgint as Message;
    const interaction = msgint as CommandInteraction;
    var Embed: EmbedBuilder;
    switch (res.loadType) {
      case "LOAD_FAILED":
        if (!player.queue.current) player.destroy();
        Embed = await this.LoadTypeEmbeds(msgint, "Fail");
        break;
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        Embed = await this.LoadTypeEmbeds(msgint, "NoMatches");
        break;
      case "SEARCH_RESULT":
        if (player.state !== "CONNECTED") {
          player.SetPlayerMessage(msgint as any);
          player.SetPlayerAuthor(msgint as any);
          player.connect();
          player.queue.add(res.tracks[0]);
          player.play();
          player.pause(false);
        } else if (!player.queue || !player.queue.current) {
          player.queue.add(res.tracks[0]);
          player.play();
          player.pause(false);
        } else {
          player.queue.add(res.tracks[0]);
        }
        Embed = await this.LoadTypeEmbeds(
          msgint,
          "Success",
          args,
          isSlash,
          res.tracks[0]
        );
        break;
      case "TRACK_LOADED":
        if (player.state !== "CONNECTED") {
          player.SetPlayerMessage(msgint as any);
          player.SetPlayerAuthor(msgint as any);
          player.connect();
          player.queue.add(res.tracks[0]);
          player.play();
          player.pause(false);
        } else if (!player.queue || !player.queue.current) {
          player.queue.add(res.tracks[0]);
          player.play();
          player.pause(false);
        } else {
          player.queue.add(res.tracks[0]);
        }
        Embed = await this.LoadTypeEmbeds(
          msgint,
          "Success",
          args,
          isSlash,
          res.tracks[0]
        );
        break;
      case "PLAYLIST_LOADED":
        await this.Playlist();
        break;
    }

    if (isSlash) {
      interaction.followUp({ embeds: [Embed] });
    } else {
      message.reply({ embeds: [Embed] });
    }
  }

  private async Checker(
    msgint: Message | CommandInteraction,
    args: Array<string> | CommandInteractionOptionResolver,
    isSlash: boolean
  ) {
    const URLs = URLList.Music;
    const MusicEmojis = Emojis.Music;
    var Emoji: string;
    var Name: string;
    var args2: any;
    var msgint2: any;
    var ObjectReturned: any;

    var Object = [
      ...new Set([
        { URL: URLs.Youtube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
        { URL: URLs.ShortYoutube, Name: "Youtube", Emoji: MusicEmojis.Youtube },
        { URL: URLs.Spotify, Name: "Spotify", Emoji: MusicEmojis.Spotify },
        {
          URL: URLs.SoundCloud,
          Name: "Soundcloud",
          Emoji: MusicEmojis.SoundCloud,
        },
        { URL: URLs.Deezer, Name: "Deezer", Emoji: MusicEmojis.Deezer },
        { URL: URLs.Facebook, Name: "Facebook", Emoji: MusicEmojis.Facebook },
        { URL: URLs.Apple, Name: "Apple Music", Emoji: MusicEmojis.Apple },
      ]),
    ];
    const ObjectMapped = Object.map((object) => {
      return {
        URL: object.URL,
        Name: object.Name,
        Emoji: object.Emoji,
      };
    });

    if (isSlash) {
      msgint2 = msgint as CommandInteraction;
      args2 = args as CommandInteractionOptionResolver;
      ObjectReturned = ObjectMapped.map((object) => {
        const Query = args2.get("query").value;
        if (Query.includes(object.URL)) {
          Emoji = object.Emoji;
          Name = object.Name;
        } else {
          Emoji = MusicEmojis.Youtube;
          Name = "Youtube";
        }
      });
    } else {
      msgint2 = msgint as Message;
      args2 = args as Array<string>;
      ObjectReturned = ObjectMapped.map((object) => {
        const Query = args2.join(" ");
        if (Query.includes(object.URL)) {
          Emoji = object.Emoji;
          Name = object.Name;
        } else {
          Emoji = MusicEmojis.Youtube;
          Name = "Youtube";
        }
      });
    }
    ObjectReturned = { Emoji, Name };

    return ObjectReturned;
  }

  private async NoChannelEmbed(
    msgint: Message | CommandInteraction
  ): Promise<EmbedBuilder> {
    const member = msgint.guild.members.cache.get(msgint.member.user.id);
    return new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.displayAvatarURL({ extension: "gif" }),
      })
      .setColor("#c20e00")
      .setTitle(
        await this.client.translate(
          "Tools/ErelaTools:NoChannelEmbed:Title",
          msgint
        )
      )
      .setDescription(
        await this.client.translate(
          "Tools/ErelaTools:NoChannelEmbed:Description",
          msgint
        )
      )
      .setFooter({
        text: await this.client.translate(
          "Tools/ErelaTools:NoChannelEmbed:Footer",
          msgint
        ),
        iconURL: this.client.user.displayAvatarURL(),
      })
      .setTimestamp();
  }

  private async NoArgsEmbed(
    msgint: Message | CommandInteraction
  ): Promise<EmbedBuilder> {
    const member = msgint.guild.members.cache.get(msgint.member.user.id);
    return new EmbedBuilder()
      .setAuthor({
        name: member.user.tag,
        iconURL: member.displayAvatarURL({ extension: "gif" }),
      })
      .setColor("#c20e00")
      .setTitle(
        await this.client.translate(
          "Tools/ErelaTools:NoArgsEmbed:Title",
          msgint
        )
      )
      .setDescription(
        await this.client.translate(
          "Tools/ErelaTools:NoArgsEmbed:Description",
          msgint
        )
      )
      .setFooter({
        text: await this.client.translate(
          "Tools/ErelaTools:NoArgsEmbed:Footer",
          msgint
        ),
        iconURL: this.client.user.displayAvatarURL(),
      })
      .setTimestamp();
  }

  private async LoadTypeEmbeds(
    msgint: Message | CommandInteraction,
    loadType: string,
    args?: Array<string> | CommandInteractionOptionResolver,
    isSlash?: boolean,
    track?: Track
  ): Promise<EmbedBuilder> {
    const member = msgint.guild.members.cache.get(msgint.member.user.id);
    const ActiveChecker: any = await this.Checker(msgint, args, isSlash);
    var Embed: EmbedBuilder;
    switch (loadType) {
      case "Fail":
        Embed = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.displayAvatarURL({ extension: "gif" }),
          })
          .setColor("#c20e00")
          .setTitle(
            await this.client.translate(
              "Tools/ErelaTools:loadType:LOAD_FAILED:Embed:Title",
              msgint
            )
          )
          .setDescription(
            await this.client.translate(
              "Tools/ErelaTools:loadType:LOAD_FAILED:Embed:Description",
              msgint
            )
          )
          .setFooter({
            text: await this.client.translate(
              "Tools/ErelaTools:loadType:LOAD_FAILED:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setTimestamp();
        break;
      case "NoMatches":
        Embed = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.displayAvatarURL({ extension: "gif" }),
          })
          .setColor("#c20e00")
          .setTitle(
            await this.client.translate(
              "Tools/ErelaTools:loadType:NO_MATCHES:Embed:Title",
              msgint
            )
          )
          .setDescription(
            await this.client.translate(
              "Tools/ErelaTools:loadType:NO_MATCHES:Embed:Description",
              msgint
            )
          )
          .setFooter({
            text: await this.client.translate(
              "Tools/ErelaTools:loadType:NO_MATCHES:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setTimestamp();
        break;
      case "Success":
        var Timer: any = "WIP Timer...";
        Embed = new EmbedBuilder()
          .setAuthor({
            name: member.user.tag,
            iconURL: member.displayAvatarURL({ extension: "gif" }),
          })
          .setColor("#00c26f")
          .setTitle(
            await this.client.translate(
              "Tools/ErelaTools:loadType:SUCCESS:Embed:Title",
              msgint
            )
          )
          .addFields([
            {
              name: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:1",
                msgint,
                { EMOJI: ActiveChecker.Emoji, NAME: ActiveChecker.Name }
              ),
              value: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:Content:1",
                msgint,
                { TITLE: track.title, URI: track.uri }
              ),
              inline: true,
            },
            {
              name: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:2",
                msgint
              ),
              value: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:Content:2",
                msgint,
                { AUTHOR: track.author }
              ),
              inline: true,
            },
            {
              name: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:3",
                msgint
              ),
              value: await this.client.translate(
                "Tools/ErelaTools:loadType:SUCCESS:Embed:Fields:Content:3",
                msgint,
                { TIMER: Timer }
              ),
              inline: true,
            },
          ])
          .setThumbnail(track.thumbnail)
          .setFooter({
            text: await this.client.translate(
              "Tools/ErelaTools:loadType:SUCCESS:Embed:Footer",
              msgint
            ),
            iconURL: this.client.user.displayAvatarURL(),
          })
          .setTimestamp();
        break;
    }

    return Embed;
  }
}
