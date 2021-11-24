const dayjs = require("dayjs");

const db = require("../db");

module.exports = async ctx => {
    const _ = ctx._.commands.stats;

    const stats = await db.getStats(ctx.from.id);

    ctx.replyWithMarkdown(_.responses.ok
        .replace("{n_medias}", stats.n_medias)
        .replace("{n_images}", stats.n_images)
        .replace("{n_gifs}",   stats.n_gifs)
        .replace("{n_videos}", stats.n_videos)

        .replace("{n_tags}",   stats.n_tags)
        .replace("{avg_tags}", stats.avg_tags.toFixed(1))

        .replace("{start_date}", dayjs(stats.start_date).format(ctx._.locale.datetime))

        .replace("{most_used_tags}", stats.most_used_tags.join('\n')));
};
