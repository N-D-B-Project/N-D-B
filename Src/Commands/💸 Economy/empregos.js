const BaseCommand = require("../../Utils/Structures/BaseCommand");
const Discord = require("discord.js");
//const {} = require("../../../Config/Abbreviations.js");
const Cash = require("../../Database/Schemas/NDCash");

module.exports = class EmpregosCommand extends BaseCommand {
  constructor(...args) {
    super(...args, {
      name: "empregos",
      category: "💸 Economy",
      aliases: ["job", "jobs"],
      usage: "",
      description: "Mude de emprego utilizando esse comando!"
    });
  }
  async run(client, message, args) {
    
  }
};
