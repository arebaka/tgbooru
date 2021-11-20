module.exports = async ctx => {
    ctx.replyWithMarkdown(
            ctx.from._.commands.help.responses.ok
                .replace("{commands}", ctx.from._.list_of_commands)
        );
};
