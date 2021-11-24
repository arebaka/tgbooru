const db   = require("../db");
const i18n = require("../i18n");

module.exports = async (ctx, data) => {
    if (!i18n[ctx.match[1]])
        return ctx.answerCbQuery(ctx._.callbacks.lang.responses.no_lang, true);

    await db.setLang(ctx.from.id, ctx.match[1]);
    ctx._ = i18n[ctx.match[1]];

    ctx.editMessageText(ctx._.commands.lang.responses.ok);
};
