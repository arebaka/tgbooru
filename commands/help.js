module.exports = async ctx => {
    ctx.replyWithMarkdown(
        ctx._.commands.help.responses.ok
            .replace("{commands}", ctx._.list_of_commands));
};
