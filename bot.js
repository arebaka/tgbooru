const path = require("path");
const fs   = require("fs");

const { Telegraf, Markup } = require("telegraf");

const db     = require("./db");
const config = require("./config");

const commands  = require("./commands");
const callbacks = require("./callbacks");
const i18n      = require("./i18n");




class Bot
{
    constructor(token)
    {
        this.token    = token;
        this.username = null;
        this.bot      = new Telegraf(this.token);

        this.bot.use(async (ctx, next) => {
            try {
                let user = ctx.from && await db.setUser(
                    ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name);

                ctx.from._ = i18n[user.lang];

                await next();
            }
            catch (err) {
                console.error(err);
            }
        });

        this.bot.on("callback_query", async ctx => {
            const query = ctx.update.callback_query;
            const data  = query.data.split(':');

            switch (data[0]) {
                case "start": return callbacks.start(ctx, data);
                case "lang":  return callbacks.lang(ctx, data);
                default:      return ctx.answerCbQuery(ctx.from._.errors.unknown_callback, true);
            }
        });

        this.bot.start(async ctx => {
            const markup = Markup.inlineKeyboard([
                    Markup.button.callback("English", "start:eng"),
                    Markup.button.callback("Русский", "start:rus")
                ]);

            ctx.replyWithMarkdown("Choose the language\nВыберите язык", markup);
        });

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

        this.bot.on("inline_query", async ctx => {

        });
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
