const config = require("../config");
const db     = require("../db");

module.exports = async ctx => {
    const _       = ctx.from._.commands.deltag;
    const replyTo = ctx.message.reply_to_message;
    const tags    = ctx.message.text
        .trim().split(' ').slice(1);

    if (!replyTo || !(replyTo.photo || replyTo.animation || replyTo.video))
        return ctx.replyWithMarkdown(_.responses.media_required);
    if (!tags.length)
        return ctx.replyWithMarkdown(_.responses.tags_required);

    const type  = ["photo", "animation", "video"].find(t => replyTo[t]);
    const file  = type == "photo" ? replyTo.photo.pop() : replyTo[type];
    const media = await db.getMedia(ctx.from.id, file.file_unique_id);

    if (!media)
        return ctx.replyWithMarkdown(_.responses.no_media
            .replace("{media}", ctx.from._.medias[type]));

    await db.remMediaTags(media.id, tags);

    ctx.replyWithMarkdown(_.responses.ok
        .replace("{media}", ctx.from._.medias[type]));
}
