const Config = require("../../Config/Config.json");
const ndbbugs = Config.ndbbugs;
module.exports = class Tools {

    constructor(client) {
        this.client = client;
    }

    checkOwner(target) {
		return this.client.owners.includes(target);
    }

    checkTestGuild(target) {
        return this.client.config.testGuilds.includes(target);
    }

    checkMJGuild(target) {
        return this.client.config.MJGuild.includes(target);
    }

    categoryCheck(category, message) {
        category = category.toLowerCase();
        switch (category) {
            case 'Developer Tools':
                return this.checkOwner(message.author.id);
            case '👮‍♂️ Moderation':
                return message.member.hasPermission('MANAGE_GUILD');
            case 'nsfw':
                return message.channel.nsfw;
                
            default:
                return true;
        }
    }
    
    reportError(client, guild, error, string) {
        const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
        Error ocorreu em: \`${guild.name}\`
        Ocorreu no Comando: \`${string}\`
        Erro: \n
        ${error}`)
        client.channels.cache.get(ndbbugs).send(embed);
    }

    capitalize(string) {
        return string.split(" ")
            .map(str => str.slice(0, 1)
            .toUpperCase() + str.slice(1))
            .join(" ");
    }

    removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    comparePerms(member, target) {
        return member.roles.highest.position < target.roles.highest.position;
    }

    formatArray(array, type = 'conjunction') {
        return new Intl.ListFormat('pt-BR', { style: 'short', type: type }).format(array);
    }

    formatBytes(bytes) {
        if(bytes === 0) return "0 Bytes"
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }
    
    formatPerms(perm) {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
            .replace(/_/g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use Voice Acitvity');
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

    DataCheck(target) {
        if(target == undefined || false) {
            return false
        } else if(target == true) {
            return true
        }
    }

    randomEmoji = [
        "<a:OPensador:718195925327151134>",
        "<a:Carregando2:718196278646800424>",
        "<a:Carregando:718196232757182566>",
        "<:DelayPing:718196166399098901>",
        //"<a:SapoDoido:718196095624413304>",
        "<a:Block:718196377678774386>"
    ]
    
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
        "Lave as mãos"
    ];

    filterLevels = {
        DISABLED: 'Off',
        MEMBERS_WITHOUT_ROLES: 'No Role',
        ALL_MEMBERS: 'Everyone'
    };
    
    verificationLevels = {
        NONE: 'None',
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: '(╯°□°）╯︵ ┻━┻',
        VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
    };
    
    regions = {
        brazil: 'Brazil',
        europe: 'Europe',
        hongkong: 'Hong Kong',
        india: 'India',
        japan: 'Japan',
        russia: 'Russia',
        singapore: 'Singapore',
        southafrica: 'South Africa',
        sydney: 'Sydney',
        'us-central': 'US Central',
        'us-east': 'US East',
        'us-west': 'US West',
        'us-south': 'US South'
    }

    Status = [
        { name: "Best Bot of Discord", type: "LISTENING" },
        { name: "Utilize &help para ver os comandos", type: "WATCHING" },
        { name: `&yt para ver o canal do meu criador`, type: "WATCHING" },
        { name: "Minecraft", type: "PLAYING" },
        { name: "GTA V", type: "PLAYING" },
        { name: "Rocket League", type: "PLAYING" },
        { name: "League Of Legends", type: "STREAMING", url: "https://twitch.tv/NedcloarBR" },
        { name: "VALORANT", type: "STREAMING", url: "https://twitch.tv/NedcloarBR" },
        { name: "Terraria", type: "STREAMING", url: "https://twitch.tv/NedcloarBR" },
    ]

    flags = {
        DISCORD_EMPLOYEE: 'Discord Employee',
        DISCORD_PARTNER: 'Discord Partner',
        BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
        BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
        HYPESQUAD_EVENTS: 'HypeSquad Events',
        HOUSE_BRAVERY: '<:Bravery:734515839180603413>',
        HOUSE_BRILLIANCE: '<:Brilliance:734515799238246462>',
        HOUSE_BALANCE: '<:Balance:734515830913630329>',
        EARLY_SUPPORTER: 'Early Supporter',
        TEAM_USER: 'Team User',
        SYSTEM: 'System',
        VERIFIED_BOT: 'Verified Bot',
        VERIFIED_DEVELOPER: 'Verified Bot Developer',
        NITRO: '<a:Nitro:718196422582861906>'
    };

    levels = {
        //none: 0.0,
        low: 0.10,
        medium: 0.15,
        high: 0.25,
        veryhigh: 0.5,
        ultrahigh: 0.75,
        megahigh: 1,
        extreme: 2,
        earhape: 10,
        surdo: 1000,
        infinity: 999999999999999999999,
    }
}