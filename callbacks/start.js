const db   = require("../db");
const i18n = require("../i18n");

module.exports = async (ctx, data) => {
    if (!i18n[data[1]])
        return ctx.answerCbQuery(ctx.from._.callbacks.start.responses.no_lang, true);

    await db.setLang(ctx.from.id, data[1]);
    ctx.from._ = i18n[data[1]];

    ctx.editMessageText(ctx.from._.commands.start.responses.ok
        .replace("{name}",     ctx.from._.name)
        .replace("{commands}", ctx.from._.list_of_commands));
};
