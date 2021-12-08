const config = require("../config");
const db     = require("../db");

module.exports = async ctx => {
    const _       = ctx._.edited;
    let   message = ctx.update.edited_message;

    if (message.text) {
        message = message.reply_to_message;
        message.caption = ctx.update.edited_message.text.replace(/^\/(add|replace)\s+/, "");
    }

    const tags = message.caption.trim().split(/\s+/g);

    if (!message.photo && !message.animation && !message.video) return;
    if (!tags.length) return;

    if (tags.length > config.maxNTags)
        return ctx.replyWithMarkdown(_.responses.too_many_tags)
            .replace("{limit}", config.maxNTags);

    const type  = ["photo", "animation", "video"].find(t => message[t]);
    const file  = type == "photo" ? message.photo.pop() : message[type];
    const media = await db.getMedia(ctx.from.id, file.file_unique_id);

    if (media) {
        await db.editMedia(media.id, tags);
        ctx.replyWithMarkdown(_.responses.replaced
            .replace("{media}", ctx._.medias[type]));
    }
    else {
        await db.addMedia(ctx.from.id, type, file.file_unique_id, file.file_id, tags);
        ctx.replyWithMarkdown(_.responses.added
            .replace("{media}", ctx._.medias[type]));
    }
};
