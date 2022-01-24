const { Telegraf, Composer } = require("telegraf");

const db     = require("./db");
const config = require("./config");
const logger = require("./logger");

const middlewares = require("./middlewares");
const handlers    = require("./handlers");
const commands    = require("./commands");
const callbacks   = require("./callbacks");

module.exports = class Bot
{
	constructor(token)
	{
		this.token    = token;
		this.username = null;
		this.bot      = new Telegraf(this.token);

		this.bot.use(middlewares.updateUser);

		this.bot.on("inline_query",         handlers.inline);
		this.bot.on("chosen_inline_result", handlers.chosen_inline);

		this.bot.on("edited_message",
			Composer.filter(ctx => ctx.chat.type == "private"
				&& (ctx.update.edited_message.caption || (
					ctx.update.edited_message.text
					&& ctx.update.edited_message.reply_to_message && (
						ctx.update.edited_message.text.startsWith("/add")
						|| ctx.update.edited_message.text.startsWith("/replace"))))),
			handlers.edited_message);

		this.bot.on(
			["photo", "animation", "video"],
			Composer.filter(ctx => ctx.chat.type == "private" && ctx.message.caption),
			handlers.media);

		this.bot.start(commands.start)

		this.bot.command("help",    commands.help);
		this.bot.command("lang",    commands.lang);
		this.bot.command("add",     commands.add);
		this.bot.command("delete",  commands.delete);
		this.bot.command("info",    commands.info);
		this.bot.command("replace", commands.replace);
		this.bot.command("addtag",  commands.addtag);
		this.bot.command("deltag",  commands.deltag);
		this.bot.command("edittag", commands.edittag);
		this.bot.command("stats",   commands.stats);

		this.bot.action(/^start:([^:]+)$/, callbacks.start);
		this.bot.action(/^lang:([^:]+)$/,  callbacks.lang);
	}

	async start()
	{
		await db.start();

		this.bot
			.launch(config.bot.params)
			.then(res => {
				this.username = this.bot.botInfo.username;
				logger.info(`Bot @${this.username} started.`);
			})
			.catch(err => {
				logger.fatal(err);
				process.exit(1);
			});
	}

	async stop()
	{
		logger.info(`Stop the bot @${this.username}`);

		await this.bot.stop();
		await db.stop();

		process.exit(0);
	}

	async reload()
	{
		logger.info(`Reload the bot @${this.username}`);

		await this.bot.stop();
		await db.stop();
		await this.start();
	}
}
