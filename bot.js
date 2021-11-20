const Telegraf = require("telegraf").Telegraf;

const db     = require("./db");
const config = require("./config");

const middlewares = require("./middlewares");
const handlers    = require("./handlers");
const commands    = require("./commands");




class Bot
{
    constructor(token)
    {
        this.token    = token;
        this.username = null;
        this.bot      = new Telegraf(this.token);

        this.bot.use(middlewares.updateUser);

        this.bot.on("callback_query", handlers.callback);
        this.bot.on("inline_query",   handlers.inline);

        this.bot.start(commands.start)

        this.bot.command("help",   commands.help);
        this.bot.command("lang",   commands.lang);
        this.bot.command("add",    commands.add);
        this.bot.command("delete", commands.delete);
        this.bot.command("info",   commands.info);
//        this.bot.command("edit",   commands.edit);
//        this.bot.command("addtag", commands.addtag);
//        this.bot.command("deltag", commands.deltag);
//        this.bot.command("retag",  commands.retag);
//        this.bot.command("stats",  commands.stats);

    }

    async start()
    {
        await db.start();

        this.bot
            .launch(config.params)
            .then(res => {
                this.username = this.bot.botInfo.username;
                console.log(`Bot @${this.username} started.`);
            })
            .catch(err => {
                console.error(err);
                this.bot.stop();
            });
    }

    async stop()
    {
        console.log(`Stop the bot @${this.username}`);

        this.bot.stop();
        await db.stop();
    }

    async reload()
    {
        console.log(`Reload the bot @${this.username}`);

        await this.stop();
        await this.start();
    }
}




module.exports = Bot;
