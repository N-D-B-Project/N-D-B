import { Injectable } from "@nestjs/common";
import { AttachmentBuilder, type Message, type TextChannel } from "discord.js";

interface TranscriptMessage {
	author: string;
	authorId: string;
	content: string;
	attachments: string[];
	timestamp: Date;
}

@Injectable()
export class TranscriptService {
	public async fetchMessages(channel: TextChannel): Promise<TranscriptMessage[]> {
		const messages: TranscriptMessage[] = [];
		let lastId: string | undefined;

		while (true) {
			const batch = await channel.messages.fetch({
				limit: 100,
				...(lastId ? { before: lastId } : {}),
			});

			if (batch.size === 0) break;

			for (const msg of batch.values()) {
				messages.push({
					author: msg.author.displayName,
					authorId: msg.author.id,
					content: msg.content,
					attachments: msg.attachments.map((a) => a.url),
					timestamp: msg.createdAt,
				});
			}

			lastId = batch.lastKey();
		}

		return messages.reverse();
	}

	public generateTxt(messages: TranscriptMessage[], channelName: string, guildName: string): AttachmentBuilder {
		const header = `Transcript - #${channelName} (${guildName})\nGenerated at: ${new Date().toISOString()}\n${"=".repeat(60)}\n\n`;

		const lines = messages.map((msg) => {
			const time = msg.timestamp.toISOString().replace("T", " ").slice(0, 19);
			let line = `[${time}] ${msg.author}: ${msg.content}`;
			if (msg.attachments.length > 0) {
				line += `\n  Attachments: ${msg.attachments.join(", ")}`;
			}
			return line;
		});

		const content = header + lines.join("\n");

		return new AttachmentBuilder(Buffer.from(content, "utf-8"), {
			name: `${channelName}.txt`,
		});
	}

	public generateHtml(messages: TranscriptMessage[], channelName: string, guildName: string): AttachmentBuilder {
		const messagesHtml = messages
			.map((msg) => {
				const time = msg.timestamp.toISOString().replace("T", " ").slice(0, 19);
				const escapedContent = this.escapeHtml(msg.content).replace(/\n/g, "<br>");
				const attachmentsHtml = msg.attachments.length > 0
					? `<div class="attachments">${msg.attachments.map((url) => {
							if (/\.(png|jpg|jpeg|gif|webp)$/i.test(url)) {
								return `<a href="${this.escapeHtml(url)}" target="_blank"><img src="${this.escapeHtml(url)}" alt="attachment"></a>`;
							}
							return `<a href="${this.escapeHtml(url)}" target="_blank">${this.escapeHtml(url)}</a>`;
						}).join("")}</div>`
					: "";

				return `<div class="message"><div class="header"><span class="author">${this.escapeHtml(msg.author)}</span><span class="time">${time}</span></div><div class="content">${escapedContent}</div>${attachmentsHtml}</div>`;
			})
			.join("");

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>#${this.escapeHtml(channelName)} - Transcript</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#313338;color:#dbdee1;font-family:Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.375}
.container{max-width:900px;margin:0 auto;padding:16px}
.header-bar{background:#2b2d31;border-radius:8px;padding:16px 20px;margin-bottom:16px}
.header-bar h1{font-size:18px;color:#f2f3f5;margin-bottom:4px}
.header-bar p{font-size:13px;color:#949ba4}
.message{padding:4px 20px;margin:4px 0;border-radius:4px}
.message:hover{background:#2e3035}
.message .header{margin-bottom:2px}
.message .author{font-weight:600;color:#f2f3f5;margin-right:8px}
.message .time{font-size:12px;color:#949ba4}
.message .content{word-wrap:break-word;white-space:pre-wrap}
.message .attachments{margin-top:8px}
.message .attachments img{max-width:400px;max-height:300px;border-radius:8px;margin:4px 0;display:block}
.message .attachments a{color:#00a8fc;text-decoration:none}
.message .attachments a:hover{text-decoration:underline}
</style>
</head>
<body>
<div class="container">
<div class="header-bar">
<h1>#${this.escapeHtml(channelName)}</h1>
<p>${this.escapeHtml(guildName)} — ${messages.length} messages — Generated at ${new Date().toISOString()}</p>
</div>
${messagesHtml}
</div>
</body>
</html>`;

		return new AttachmentBuilder(Buffer.from(html, "utf-8"), {
			name: `${channelName}.html`,
		});
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}
}
