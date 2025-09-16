const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
require("dotenv").config({ path: ".env.production" });

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", async () => {
	const rest = new REST({ version: "10" }).setToken(process.env.Token);

	try {
		console.log("Removing all global commands...");

		const globalCommands = await rest.get(
			Routes.applicationCommands(process.env.ClientId),
		);
		for (const cmd of globalCommands) {
			await rest.delete(
				Routes.applicationCommand(process.env.ClientId, cmd.id),
			);
			console.log(`Global command "${cmd.name}" removed`);
		}
		console.log("All global commands removed.");

		for (const [guildId, guild] of client.guilds.cache) {
			try {
				console.log(
					`Removing commands from guild "${guild.name}" (${guildId})...`,
				);
				const guildCommands = await rest.get(
					Routes.applicationGuildCommands(process.env.ClientId, guildId),
				);
				for (const cmd of guildCommands) {
					await rest.delete(
						Routes.applicationGuildCommand(
							process.env.ClientId,
							guildId,
							cmd.id,
						),
					);
					console.log(
						`Command "${cmd.name}" removed from guild "${guild.name}"`,
					);
				}
			} catch (err) {
				console.warn(`Could not access guild "${guild.name}": ${err.message}`);
			}
		}

		console.log("Finished removing commands from all accessible guilds.");
	} catch (error) {
		console.error(error);
	} finally {
		client.destroy();
	}
});

client.login(process.env.Token);
