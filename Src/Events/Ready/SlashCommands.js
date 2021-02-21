require("dotenv").config();

const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Discord = require("discord.js");

const colors = require("colors");

const options = {
	timeZone: 'America/Sao_Paulo',
	hour: 'numeric',
    minute: 'numeric',
    seconds: 'numeric'
};
const date = new Intl.DateTimeFormat([], options);

module.exports = class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
    async run(client, message) {
        async function createAPIMessage(interaction, content) {
            const apiMessage = await Discord.APIMessage.create(client.channels.resolve(interaction.channel_id), content)
                .resolveData()
                .resolveFiles();
            
            return { ...apiMessage.data, files: apiMessage.files };
        }

        client.api.applications(client.user.id).commands.post({
            data: {
              name: "bestbot",
              description: "Diz qual o melhor bot do Discord",
            },
            data: {
              name: "ping",
              description: "Mostra o ping do Bot"
            }
        })
        
        client.ws.on("INTERACTION_CREATE", async interaction => {
            const command = interaction.data.name.toLowerCase();
            const args = interaction.data.options;
            if(command == "bestbot") {
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 3,
                        data: {
                          content: "N-D-B"
                        }
                    }
                })
            }
            if(command == "ping") {
              const embed = new Discord.MessageEmbed()
                .setTimestamp()
                .setTitle("Pong?")
                .setColor(client.embed.color)
                .setDescription(
                  // `📡 The Latency is ${Math.floor(
                  //   message.createdTimestamp - message.createdTimestamp
                  // )}ms.
                  //\n
                  `🖥 The API Latency is ${client.ws.ping}ms.`
                )
                .setFooter("ping", client.user.displayAvatarURL());
              client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 3,
                    data: await createAPIMessage(interaction, embed)
                }
            })
            }
          })
    }
}
