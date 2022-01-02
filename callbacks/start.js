const db   = require("../db");
const i18n = require("../i18n");

module.exports = async (ctx, data) => {
	if (!i18n[ctx.match[1]])
		return ctx.answerCbQuery(ctx._.callbacks.start.responses.no_lang, true);

	await db.setLang(ctx.from.id, ctx.match[1]);
	ctx._ = i18n[ctx.match[1]];

	ctx.editMessageText(ctx._.commands.start.responses.ok
		.replace("{name}",     ctx._.name)
		.replace("{commands}", ctx._.list_of_commands));
};
