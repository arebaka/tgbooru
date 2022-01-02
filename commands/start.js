const Markup = require("telegraf").Markup;

module.exports = async ctx => {
	const markup = Markup.inlineKeyboard([
		Markup.button.callback("English", "start:eng"),
		Markup.button.callback("Русский", "start:rus")
	]);

	ctx.replyWithMarkdown("Choose the language\nВыберите язык", markup);
};
