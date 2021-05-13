const Discord = require("discord.js");
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook");

const clientID = process.env.SpotifyID;
const clientSecret = process.env.SpotifySecret;

module.exports = function (client) {
    return new Manager({
        plugins: [ 
            new Spotify({ clientID, clientSecret }),
            new Deezer(), 
            new Facebook(),
        ],
        nodes: [
          {
            host: process.env.HOST,
            port: 2333,
            password: process.env.PASSWORD,
          },
        ],
        send(id, payload) {
          const guild = client.guilds.cache.get(id);
          if(guild) guild.shard.send(payload);
        },
    })
        .on("nodeConnect", (node) => {
            client.logger.music("Node Conectado! " + node.options.identifier)
        })
        .on("nodeCreate", (node) => {
            client.logger.music("Node Criado! " + node.options.identifier)
        })
        .on("nodeReconnect", (node) => {
            client.logger.music("Node Reconectado! " + node.options.identifier)
        })
        .on("nodeDisconnect", (node) => {
            client.logger.music("Node Desconectado! " + node.options.identifier)
        })
        .on("nodeError", (node, error) => {
            client.logger.music("Node Error! " + error.message + ` ${node.options.identifier}`)
        })
        .on("playerCreate", async (player) => {
            player.setVolume(50);
            player.set("autoplay", true);
            player.set(`afk-${player.guild}`, false)
            player.set(`afk-${player.get("playerauthor")}`, false)
            //player.setEQ(client.eqs.music);
        })
        .on("playerMove", async (player, oldChannel, newChannel) => {
            if(!newChannel){
                const embed = new Discord.MessageEmbed()
                    .setColor("#00c26f")
                    .setTitle("Fila de Musicas Acabou!")
                    .setDescription(`Sai do Canal: \`🔈 ${client.channels.cache.get(player.voiceChannel).name}\``)
                    .setFooter(client.user.tag, client.user.displayAvatarURL())
                client.channels.cache.get(player.textChannel).send(embed);
                try {
                    client.channels.cache.get(player.textChannel).messages.fetch(player.get("playermessage")).then(msg => {
                        try {
                            msg.delete({
                                timeout: 2000
                            }).catch(error => client.logger.error("Crash Prevent"))
                        } catch {}
                    });
                } catch (error) {
                    client.logger.error(error)
                }
                player.destroy();
            } else {
                player.voiceChannel = newChannel;
                if(player.paused) return;
                setTimeout(() =>{
                    player.pause(true);
                    setTimeout(() => player.pause(false), client.ws.ping * 2);
                }, client.ws.ping * 2);
            }
        })
        .on("trackStart", async (player, track) => {
            player.setVolume(50);
        })
        
}