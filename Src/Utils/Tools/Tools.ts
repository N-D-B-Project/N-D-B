import NDBClient from "@/Client/Client";
import * as Discord from "discord.js";
import Command from "@Tools/Command";
import Embeds from "@Tools/Embeds";
import Buttons from "@Tools/Buttons";
import Selections from "@Tools/Selections";

export default class Tools {
  private client: NDBClient;
  public command: Command;
  public embeds: Embeds;
  public buttons: Buttons;
  public selections: Selections;

  constructor(client) {
    this.client = client;
    this.command = new Command(client);
    this.embeds = new Embeds(client);
    this.buttons = new Buttons(client);
    this.selections = new Selections(client);
  }

  checkOwner(target) {
    return this.client.Config.Owners.includes(target);
  }

  checkTestGuild(target) {
    return this.client.Config.TestGuilds.includes(target);
  }

  categoryCheck(category, message) {
    category = category.toLowerCase();
    switch (category) {
      case "Developer Tools":
        return this.checkOwner(message.author.id);
      case "👮‍♂️ Moderation":
        return message.member.hasPermission("MANAGE_GUILD");
      case "nsfw":
        return message.channel.nsfw;

      default:
        return true;
    }
  }

  reportError(client, guild, error, string) {
    const embed = new Discord.MessageEmbed().setColor(client.config.color)
      .setDescription(`
        Error ocorreu em: \`${guild.name}\`
        Ocorreu no Comando: \`${string}\`
        Erro: \n
        ${error}`);
    client.channels.cache.get(this.client.Config.NDB_Bugs).send(embed);
  }

  capitalize(string) {
    return string
      .split(" ")
      .map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
      .join(" ");
  }

  removeDuplicates(arr) {
    return [...new Set(arr)];
  }

  comparePerms(member, target) {
    return member.roles.highest.position < target.roles.highest.position;
  }

  //@ ListFormat não existe no Typescript???
  // formatArray(array, type = 'conjunction') {
  //     return new Intl.
  //     ListFormat('pt-BR', { style: 'short', type: type }).format(array);
  // }

  formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
  }

  formatPerms(perm) {
    return perm
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
      .replace(/_/g, " ")
      .replace(/Guild/g, "Server")
      .replace(/Use Vad/g, "Use Voice Acitvity");
  }

  // isURL(str) {
  //     let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  //     if(regexp.test(str)) {
  //       return true;
  //     } else {
  //       return false;
  //     }

  // }

  trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`${len} mais...`);
    }
    return arr;
  }

  CheckPlatform(platform) {
    if (platform == "win32") {
      return "<:windows:852676820213170196> Windows";
    } else if (platform == "darwin") {
      return "<:Apple:852677662983716884> Mac OS";
    } else if (platform == "freebsd") {
      return "<:freebsd:852678583641440296> FreeBSD";
    } else if (platform == "linux") {
      return "<:linux:852679127201742850> Linux";
    } else if (platform == "sunos") {
      return "Sunos";
    } else if (platform == "android") {
      return "<:android:852679609022808085> Android";
    }
  }

  static getMomentFormat(mode: 'time' | 'calendar' = 'calendar', lang = 'pt-BR'): string {
    switch (mode) {
      case 'calendar':
        if (lang === 'pt-BR') return 'DD/MM/YYYY | LTS'
        else return 'DD-MM-YYYY LTS'

      case 'time':
        if (lang === 'pt-BR') return 'L'
        else return 'DD-MM-YYYY LTS'
    }
  }

  randomEmoji = [
    "<a:OPensador:718195925327151134>",
    "<a:Carregando2:718196278646800424>",
    "<a:Carregando:718196232757182566>",
    "<:DelayPing:718196166399098901>",
    //"<a:SapoDoido:718196095624413304>", //! Desabilitado para não causar epilepsia nas pessoas
    "<a:Block:718196377678774386>",
  ];

  replies = [
    "Sim",
    "Não",
    "Definitivamente sim",
    "Definitivamente não",
    "Dimi viado",
    "Não sei responder a esta pergunta",
    "Mamma mia",
    "Óbvio",
    "'-'",
    "icarai",
    "Sad Boy",
    "190",
    "Moshi moshi keisatsu desu ka?",
    "Kon'nichiwa, keisatsudesu ka?",
    "Apenas o akinator sabe responder",
    "Pesquise no google",
    "Convide meu Bot",
    "Não vou responder agora",
    "Ta noiando?",
    "Beba água",
    "Lave as mãos",
  ];

  filterLevels = {
    DISABLED: "Off",
    MEMBERS_WITHOUT_ROLES: "No Role",
    ALL_MEMBERS: "Everyone",
  };

  verificationLevels = {
    NONE: "None",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "(╯°□°）╯︵ ┻━┻",
    VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
  };

  regions = {
    brazil: "Brazil",
    europe: "Europe",
    hongkong: "Hong Kong",
    india: "India",
    japan: "Japan",
    russia: "Russia",
    singapore: "Singapore",
    southafrica: "South Africa",
    sydney: "Sydney",
    "us-central": "US Central",
    "us-east": "US East",
    "us-west": "US West",
    "us-south": "US South",
  };

  Status = [
    { name: "Best Bot of Discord", type: "LISTENING}" },
    { name: "Utilize &help para ver os comandos", type: "WATCHING" },
    { name: `&yt para ver o canal do meu criador`, type: "WATCHING" },
    { name: "Minecraft", type: "PLAYING" },
    { name: "GTA V", type: "PLAYING" },
    { name: "Rocket League", type: "PLAYING" },
    {
      name: "League Of Legends",
      type: "STREAMING",
      url: "https://twitch.tv/NedcloarBR",
    },
    {
      name: "VALORANT",
      type: "STREAMING",
      url: "https://twitch.tv/NedcloarBR",
    },
    {
      name: "Terraria",
      type: "STREAMING",
      url: "https://twitch.tv/NedcloarBR",
    },
  ]

  flags = {
    DISCORD_EMPLOYEE: "Discord Employee",
    DISCORD_PARTNER: "Discord Partner",
    BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
    BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
    HYPESQUAD_EVENTS: "HypeSquad Events",
    HOUSE_BRAVERY: "<:Bravery:734515839180603413>",
    HOUSE_BRILLIANCE: "<:Brilliance:734515799238246462>",
    HOUSE_BALANCE: "<:Balance:734515830913630329>",
    EARLY_SUPPORTER: "Early Supporter",
    TEAM_USER: "Team User",
    SYSTEM: "System",
    VERIFIED_BOT: "Verified Bot",
    VERIFIED_DEVELOPER: "Verified Bot Developer",
    NITRO: "<a:Nitro:718196422582861906>",
  };

  levels = {
    //none: 0.0,
    low: 0.1,
    medium: 0.15,
    high: 0.25,
    veryhigh: 0.5,
    ultrahigh: 0.75,
    megahigh: 1,
    extreme: 2,
    earhape: 10,
    surdo: 1000,
    infinity: 999999999999999999999,
  };
}
