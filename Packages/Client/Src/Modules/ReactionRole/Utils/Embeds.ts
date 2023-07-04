import NDBClient from "@/Client/NDBClient"
import { Emojis } from "@/Config/Config"
import { MessageTools } from "@/Utils/Tools"
import {
  CommandInteraction,
  EmbedBuilder,
  Message,
  TextChannel,
  User
} from "discord.js"
import { REACTION_OPTIONS, iReaction } from "./../Types/index.d"

export async function InvalidChannelEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.id,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:Channel:Invalid",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function InvalidIDEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.id,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:ID:Invalid",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function MessageNotFoundEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.id,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:ID:NotFound",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function InvalidRoleEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.id,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:Role:Invalid",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function InvalidEmojiEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.id,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:Emoji:Invalid",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function ReactionRoleCreatedEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  { Channel, Message, Role, Emoji, Option }: iReaction
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:Embed:Author",
        info
      ),
      iconURL: info.guild.iconURL()
    })
    .setColor("#00c26f")
    .addFields([
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:1",
          info
        ),
        value: `<#${Channel}>`,
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:2",
          info
        ),
        value: Emoji,
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:3",
          info
        ),
        value: String(Option),
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:4",
          info
        ),
        value: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:Content:4",
          info,
          {
            MsgIdURL: await (
              await MessageTools.get(
                (await info.guild.channels.fetch(Channel)) as TextChannel,
                Message
              )
            ).url
          }
        )
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/CreateReaction:Embed:Fields:5",
          info
        ),
        value: `<@&${Role}>`
      }
    ])
}

export async function ReactionRoleRemovedEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#00c26f")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/DeleteReaction:Removed",
        info,
        { success: Emojis.accept, URL: MsgID.url }
      )
    )
}

export async function ReactionRoleUpdatedEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User,
  { Channel, Message, Role, Emoji }: iReaction,
  newOption: REACTION_OPTIONS
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#00c26f")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/UpdateReaction:Embed:Description",
        info
      )
    )
    .addFields(
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:1",
          info
        ),
        value: `<#${Channel}>`,
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:2",
          info
        ),
        value: Emoji,
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:3",
          info
        ),
        value: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:Content:3",
          info,
          {
            MsgIdURL: (
              await (
                (await info.guild.channels.fetch(Channel)) as TextChannel
              ).messages.fetch(Message)
            ).url
          }
        ),
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:4",
          info
        ),
        value: `<@${Role}>`,
        inline: true
      },
      {
        name: await client.Translate.Guild(
          "🎩 ReactionRole/UpdateReaction:Embed:Fields:5",
          info
        ),
        value: newOption.toString(),
        inline: true
      }
    )

    .setFooter({
      text: await client.Translate.Guild(
        "🎩 ReactionRole/UpdateReaction:Embed:Footer",
        info
      )
    })
}

export async function ReactionRoleDeleteAllEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User,
  status: "Confirm" | "Cancel" | "Success",
  ReactionCount: number | null
): Promise<EmbedBuilder> {
  var description: string
  var color
  switch (status) {
    case "Confirm":
      description =
        "🎩 ReactionRole/DeleteAllReactions:Embed:Description:Confirm"
      color = "#00c26f"
      break
    case "Cancel":
      description =
        "🎩 ReactionRole/DeleteAllReactions:Embed:Description:Cancel"
      color = "#c20e00"
      break
    case "Success":
      description =
        "🎩 ReactionRole/DeleteAllReactions:Embed:Description:Success"
      color = "#00c26f"
      break
  }
  return new EmbedBuilder()
    .setTitle(
      await client.Translate.Guild(
        "🎩 ReactionRole/DeleteAllReactions:Embed:Title",
        info
      )
    )
    .setAuthor({
      name: author.username,
      iconURL: author.displayAvatarURL()
    })
    .setDescription(
      await client.Translate.Guild(description, info, { NUMBER: ReactionCount })
    )
    .setColor(color)
}

//TODO: Fazer esse Embed ser mais bonito
export async function UnableToCreateReactionRoleEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/CreateReaction:UnableToCreate",
        info,
        { fail: Emojis.deny }
      )
    )
}

export async function UnableToDeleteReactionRoleEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/DeleteReaction:UnableToDelete",
        info,
        { success: Emojis.accept, URL: MsgID.url }
      )
    )
}

export async function UnableToUpdateReactionRoleEmbed(
  client: NDBClient,
  info: Message | CommandInteraction,
  author: User,
  MsgID: Message
): Promise<EmbedBuilder> {
  return new EmbedBuilder()
    .setAuthor({
      name: author.tag,
      iconURL: author.displayAvatarURL()
    })
    .setColor("#c20e00")
    .setDescription(
      await client.Translate.Guild(
        "🎩 ReactionRole/UpdateReaction:UnableToUpdate",
        info,
        { success: Emojis.accept, URL: MsgID.url }
      )
    )
}
