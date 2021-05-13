const BaseEvent = require("../../Utils/Structures/BaseEvent");
const Cash = require("../../Database/Schemas/NDCash");

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super("message");
  }

  async run(client, message, guild) {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;

    Cash.findOne ({ userId: message.author.id, },
        async (err, cash) => {
          if(err) console.error("Economy Error: " + err);
          if(!cash) {
            const newCash = new Cash({
              username: message.author.tag,
              userId: message.author.id,
              ndcash: 0,
              propina: 0,
              emprego: "Desempregado",
              level: 1,
              skin: "Default",
            });
            newCash.save().catch((err) => console.error("newCash Err: " + err));
        }
    })
  }
};
