const path = require("path");
const fs = require("fs").promises;
const BaseEvent = require("../Structures/BaseEvent");

async function registerEvents(client, dir = "") {
    const filePath = path.join(__dirname, dir);
    const files = await fs.readdir(filePath);
    for (const file of files) {
      const stat = await fs.lstat(path.join(filePath, file));
      if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
      if (file.endsWith(".js")) {
        const Event = require(path.join(filePath, file));
        if (Event.prototype instanceof BaseEvent) {
          const event = new Event();
          client.on(event.name, event.run.bind(event, client));
          client.events.set(event.name, event);
        }
      }
    } 
}

module.exports = {
  registerEvents,
}