const find = require("lyrics-finder");
const Config = require("../../Config/Config.json");
const ndbbugs = Config.ndbbugs;
module.exports = class Registry {

    constructor(client) {
        this.client = client;
    }

    checkOwner(target) {
		return this.client.owners.includes(target);
    }

    checkTestGuild(target) {
        return this.client.testGuilds.includes(target);
    }
    
    reportError(client, guild, error, string) {
        const embed = new MessageEmbed()
        .setColor(client.config.color)
        .setDescription(`
        Error ocorreu em: \`${guild.name}\`
        Ocorreu no Comando: \`${string}\`
        Erro: \n
        ${error}`)
        .setFooter("my god that's a lot of errors. good job fab, you ignoramus");
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

    isURL(str) {
        let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        if(regexp.test(str)) {
          return true;
        } else {
          return false;
        }
        
    }

    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} mais...`);
        }
        return arr;
    }

    percentage(current, max, length) {
        current = parseInt(current);
        max = parseInt(max);
        let percent = current / max;
        let result = "`[";
        if (!length) length = 20;
        for (let i = 0; i < length; i++) {
            if (i < percent * length) {
                result += "■";
            } else {
                result += "□";
            }
        }

        percent = Math.trunc(percent * 10000) / 100;
        result += "]`";
        return { bar: result, percent: percent };
    }

    embedify(client, queue, page) {
        let embeds = [];
        if (!queue) return;
        for (let i = 0; i < queue.length; i += 10) {
            ++page;
            let songArray = [];
            let tracks = queue.slice(i, i+10);
            let j = i;
            for (let track of tracks) {
                let msg = `${++j} - ${track.title}`;
                songArray.push(msg);
            }
            let embed = new MessageEmbed()
                .setColor(client.config.color)
                .setDescription(`\`\`\`css
        ${songArray.join("\n")}\`\`\``)
                .setFooter(`Page ${page}/${Math.floor(queue.length / 10)}`)
            embeds.push(embed);
        }
        return embeds;
    }

    clean(text) {
        return text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/, '@' + String.fromCharCode(8203));
    }
    async lyricsify(client, message, song, page) {
        let embeds = [];
        let lyrics;
        try {
            lyrics = await find(song.title, req.author);
            if (!lyrics) return null;
        } catch (e) {
            //reportError(client, message.guild, e, "In lyrics command: Couldn't search for lyrics");
        }

        lyrics = lyrics.split(" ");

        if (lyrics.length > 200) {
            ++page;
            for (let i = 0; i < lyrics.length; i += 200) {
                let temp = lyrics.slice(i, i + 200);
                let embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setDescription(temp.join(" "))
                    .setFooter(`Page ${page}/${Math.floor(lyrics / 200)}`);

                embeds.push(embed);
            }

            return embeds;
        } else {
            let embed = new MessageEmbed()
                .setColor("RANDOM")
                .setDescription(lyrics.join(" "))
                .setFooter("Page 1/1")

            embeds.push(embed);

            return embeds;
        }
    }
    
    Windows = {
        Maria: "Microsoft Maria Desktop",
        Zira: "Microsoft Zira Desktop",
        David: "Microsoft David Desktop",
    }

    DateOptions = {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric',
        seconds: 'numeric'
    }

    DateTime = new Intl.DateTimeFormat([], this.DateOptions);
    DataLog = this.DateTime.format(new Date())

    randomEmoji = [
        "<a:OPensador:718195925327151134>",
        "<a:Carregando2:718196278646800424>",
        "<a:Carregando:718196232757182566>",
        "<:DelayPing:718196166399098901>",
        //"<a:SapoDoido:718196095624413304>",
        "<a:Block:718196377678774386>"
    ]
    
    kisses = [
        "https://media1.tenor.com/images/78095c007974aceb72b91aeb7ee54a71/tenor.gif",
        "https://i.imgur.com/OE7lSSY.gif",
        "https://i.gifer.com/B82h.gif",
        "https://i.gifer.com/B82h.gif",
        "https://i.pinimg.com/originals/32/d4/f0/32d4f0642ebb373e3eb072b2b91e6064.gif",
        "https://cutewallpaper.org/21/anime-girl-kiss-anime-girl/Girl-Anime-GIF-Girl-Anime-KissAnime-Discover-Share-GIFs.gif",
        "https://66.media.tumblr.com/06e4ba7955ad8ee651952ad12dd47a67/39eb4a3335e0c136-8f/s540x810/976c57225a62a4ef6f7742f1937e8be2b75fae8d.gif",
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/917ca7eb-672e-46fe-b0b2-253dbe3a41fc/dasbj5r-910436e0-aacd-430b-a58c-954240190ab2.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvOTE3Y2E3ZWItNjcyZS00NmZlLWIwYjItMjUzZGJlM2E0MWZjXC9kYXNiajVyLTkxMDQzNmUwLWFhY2QtNDMwYi1hNThjLTk1NDI0MDE5MGFiMi5naWYifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.dBRJVXEmQNWpQYHMSzbwPgBgGE-ipksliWz1SL8EMbg",
        "https://i.imgur.com/Rvst3KQ.gif",
        "https://media1.tenor.com/images/ea9a07318bd8400fbfbd658e9f5ecd5d/tenor.gif?itemid=12612515",
        "https://i.imgur.com/i1PIph3.gif",
        "https://pa1.narvii.com/6248/cae38662b21747d6247776d35b8d2db50944ef08_hq.gif",
        "https://media.giphy.com/media/ONq87vZz4626k/giphy.gif",
        "https://media1.giphy.com/media/nyGFcsP0kAobm/giphy.gif",
        "https://cdn.lowgif.com/full/011acd5511e7c9fc-anime-kiss-gifs-tumblr.gif",
        "https://33.media.tumblr.com/4c3d6dbd4a87caa9ba82c8a41b9d5109/tumblr_mx3osfo7uj1rlxmzgo1_500.gif",
        "https://37.media.tumblr.com/70d58855d3d6dc8fcda71e68fe6889d0/tumblr_n5hm4rqX6O1skkm34o1_500.gif",
    ]

    waifus = [
        "https://media1.tenor.com/images/3a51c19e70a935b69a0772805147baf7/tenor.gif?itemid=13458968",
        "https://steamuserimages-a.akamaihd.net/ugc/965355694154297423/770B44AD3B8F232866833559C8309C5D58DFD783/",
        "https://media1.tenor.com/images/97848c5b98cc9718edfe8c93644f2b11/tenor.gif?itemid=17406018",
        "https://art.ngfiles.com/images/1303000/1303202_harrison2142_she-s-got-a-thing-for-pancakes.gif?f1591494744",
        "https://giffiles.alphacoders.com/487/48710.gif",
        "https://media1.tenor.com/images/6372eb4432bb604cdcf4cd228206d0d7/tenor.gif?itemid=14770476",
        "https://thumbs.gfycat.com/PassionateGiddyIzuthrush-max-1mb.gif",
        "https://66.media.tumblr.com/cc1bb9c59408ea5a5be10ec3a7a4d729/e017879c4a9e3fd7-f0/s500x750/10c84945eaf26d334d9ada4d1160790489647b31.gif",
        "https://em.wattpad.com/a761d6bba8eec094836b7f3e8d580e35ccaa9314/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f694d6d7352345f4f697568546d413d3d2d3836383031303035302e313630363964333763323633353733363438303130363735393832312e676966?s=fit&w=720&h=720",
        "https://media1.tenor.com/images/ef3a0543904fcd8dd5cdda63ff824ad4/tenor.gif?itemid=3531982",
        "https://i.pinimg.com/originals/70/9a/4d/709a4d8ed9a4202c456b15e1728012f2.gif",
        "https://i.pinimg.com/originals/f6/d8/11/f6d811475b0e8c881170fe44e38dbb50.gif",
        "https://data.whicdn.com/images/311865340/original.gif",
        "https://thumbs.gfycat.com/DetailedNastyHarvestmouse-size_restricted.gif",
        "https://thumbs.gfycat.com/BriskRealisticJackal-max-1mb.gif",
        "https://i.imgur.com/K64OpjG.gif?noredirect",
        "https://steamuserimages-a.akamaihd.net/ugc/954103112222028893/090804B2AFDE06721377FE68387A0CB7765EB582/",
        "https://i.pinimg.com/originals/3c/33/81/3c33810364a823879bc5ad69205706d2.gif",
        "https://pa1.narvii.com/7084/05a965bcf36f7bd389a2b27d505b1d91dc948cdfr1-300-360_hq.gif",
        "https://pa1.narvii.com/7084/e99ffa8dbd34db6d8e0c48961ad34b053aa9974fr1-300-360_hq.gif",
        "https://thumbs.gfycat.com/DelightfulSoulfulArcticduck-size_restricted.gif",
        "https://pa1.narvii.com/7176/ddb38c58d6fecc9f2211f6c4e1add949e9c03351r1-500-259_hq.gif",
        "https://31.media.tumblr.com/d9d19ad3f9011d6ebd7eda39ddacc0e2/tumblr_mwp5h5AXJu1r3ifxzo1_500.gif",
        "https://thumbs.gfycat.com/BruisedNiftyKiwi-size_restricted.gif",
        "https://giffiles.alphacoders.com/207/207215.gif",
        "https://media0.giphy.com/media/7C7pNe8NIpbFe/giphy.gif",
        "https://i.pinimg.com/originals/08/7a/a9/087aa968ab4707080ee908167c1e6a3a.gif",
        "https://i.pinimg.com/originals/43/91/5b/43915b2d7d46311198a624953a4921e7.gif",
        "https://thumbs.gfycat.com/DetailedJointIvorybackedwoodswallow-max-1mb.gif",
        "https://31.media.tumblr.com/2dac7eb5368454773705fb94b14027c1/tumblr_mpby42uyyI1rfbdu4o1_500.gif",
        "https://i.pinimg.com/originals/5f/08/cc/5f08ccadfab581517f073245adb5f68c.gif",
        "https://media1.tenor.com/images/f5d821db20e68ca38b678db11001212b/tenor.gif?itemid=10374472",
        "https://media1.tenor.com/images/15c4305f7caf2e6011aec85ec51bfb65/tenor.gif?itemid=10242375",
        "https://66.media.tumblr.com/e02b3113fe2f1f33f00c120e2bfb93ab/051a5eac554eaf17-f5/s500x750/acfd998713425921b0643c461fa2a3d12a9e546d.gif",
        "https://i.pinimg.com/originals/7b/d8/9c/7bd89c360645dda40e1b962e843ca331.gif",
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
        { name: "League Of Legends", type: "STREAMING", url: "https://twitch.tv/Nedcloar_BR" },
        { name: "VALORANT", type: "STREAMING", url: "https://twitch.tv/Nedcloar_BR" },
        { name: "Terraria", type: "STREAMING", url: "https://twitch.tv/Nedcloar_BR" },
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