const db = require("../db");

module.exports = async ctx => {
    const _      = ctx.from._.commands.edittag;
    const params = ctx.message.text
        .trim().split(' ').slice(1);

    if (params.length != 2)
       return ctx.replyWithMarkdown(_.responses.invalid_params);

    await db.replaceTag(params[0], params[1]);

    ctx.replyWithMarkdown(_.responses.ok
        .replace("{old}", params[0])
        .replace("{new}", params[1]));
};
