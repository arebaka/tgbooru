const callbacks = require("../callbacks");

module.exports = async ctx => {
    const query = ctx.update.callback_query;
    const data  = query.data.split(':');

    switch (data[0]) {
        case "start": return callbacks.start(ctx, data);
        case "lang":  return callbacks.lang(ctx, data);
        default:      return ctx.answerCbQuery(ctx.from._.errors.unknown_callback, true);
    }
};
