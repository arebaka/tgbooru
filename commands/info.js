const dayjs = require("dayjs");

const db = require("../db");

module.exports = async ctx => {
    const _       = ctx._.commands.info;
    const replyTo = ctx.message.reply_to_message;

    if (!replyTo || !(replyTo.photo || replyTo.animation || replyTo.video))
        return ctx.replyWithMarkdown(_.responses.media_required);

    const type  = ["photo", "animation", "video"].find(t => replyTo[t]);
    const file  = type == "photo" ? replyTo.photo.pop() : replyTo[type];
    const media = await db.getMedia(ctx.from.id, file.file_unique_id);

    if (!media)
        return ctx.replyWithMarkdown(_.responses.no_media
            .replace("{media}", ctx._.medias[type]));

    const tags = await db.getMediaTags(media.id);

    const date = dayjs(media.add_dt);

    ctx.replyWithMarkdown(_.responses.ok
        .replace("{media}", ctx._.medias[type])
        .replace("{date}",  date.format(ctx._.locale.datetime))
        .replace("{tags}",  tags.join('\n')));
};
