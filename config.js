const path = require("path");
const fs   = require("fs");
const toml = require("toml");

const config = toml.parse(fs.readFileSync(path.resolve("config.toml")));




module.exports = {
    token:    process.env.TOKEN || config.bot.token,
    dbUri:    process.env.DBURI || config.db.uri,
    maxNTags: config.limits.max_n_tags_for_media,
    params:   config.params
};
