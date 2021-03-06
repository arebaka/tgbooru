const config = require("../config");
const db     = require("../db");

module.exports = async ctx => {
	const _ = ctx._.commands.add;
	const tags = ctx.message.caption
		.trim().split(/\s+/g);

	if (!tags.length) return;
	if (tags.length > config.limits.max_n_tags)
		return ctx.replyWithMarkdown(_.responses.too_many_tags
			.replace("{limit}", config.limits.max_n_tags));

	const type  = ["photo", "animation", "video"].find(t => ctx.message[t]);
	const file  = type == "photo" ? ctx.message.photo.pop() : ctx.message[type];
	const media = await db.getMedia(ctx.from.id, file.file_unique_id);

	if (media)
		return ctx.replyWithMarkdown(_.responses.media_exists
			.replace("{media}", ctx._.medias[type]));

	await db.addMedia(ctx.from.id, type, file.file_unique_id, file.file_id, tags);

	ctx.replyWithMarkdown(_.responses.ok
		.replace("{media}", ctx._.medias[type]));
};
