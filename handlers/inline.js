const uuidv4 = require("uuid").v4;

const config = require("../config");
const db     = require("../db");

module.exports = async ctx => {
    const tags = ctx.inlineQuery.query
        ? ctx.inlineQuery.query.trim().split(/\s+/) : [];

    const medias = tags.length
        ? await db.findMedias(ctx.from.id, tags, config.maxResSize)
        : await db.getAllMedias(ctx.from.id, config.maxResSize);

    const res = medias.map(m => ({
        type: m.type == "animation" ? "mpeg4_gif" : m.type,
        id:   m.file_uid + uuidv4(),
        [{
            photo:     "photo_file_id",
            animation: "mpeg4_file_id",
            video:     "video_file_id"
        }[m.type]]: m.file_id
    }));

    ctx.answerInlineQuery(res, {
        is_personal: true,
        cache_time:  0
    });
};
