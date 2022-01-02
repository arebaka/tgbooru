const db     = require("../db");
const i18n   = require("../i18n");
const logger = require("../logger");

module.exports = async (ctx, next) => {
	try {
		let user = ctx.from && await db.setUser(
			ctx.from.id, ctx.from.username, ctx.from.first_name, ctx.from.last_name);

		ctx._ = i18n[user.lang];

		await next();
	}
	catch (err) {
		logger.error(err);
	}
};
