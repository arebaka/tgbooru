const path = require("path");
const fs   = require("fs");
const pg   = require("pg");

const config = require("../config");




class DBHelper
{
    async _addTag(word)
    {
        const tag = await this.pool.query(`
                insert into tags (tag)
                values ($1)
                on conflict (tag) do update
                set tag = $1
                returning id, tag
            `, [word]);

        return tag.rows[0];
    }

    constructor()
    {
        this.pool = null;
    }

    async start()
    {
        const sql = fs.readFileSync(path.resolve("db/init.sql"), "utf8").split(';');
        this.pool = new pg.Pool({
            connectionString: config.dbUri,
            max:              1
        });

        this.pool.on("error", async (err, client) => {
            console.error("PostgreSQL pool is down!", err);
            await this.pool.end();
            process.exit(-1);
        });

        for (let query of sql) {
            await this.pool.query(query)
                .catch(err => {});
        }
    }

    async stop()
    {
        await this.pool.end();
    }

    async restart()
    {
        await this.stop();
        await this.start();
    }

    async setUser(id, username, firstName, lastName)
    {
        const user = await this.pool.query(`
                insert into users (id, username, first_name, last_name)
                values ($1, $2, $3, $4)
                on conflict (id) do update
                set username = $2, first_name = $3, last_name = $4
                returning id, username, first_name, last_name, lang
            `, [
                id, username, firstName, lastName
            ]);

        return user.rows[0];
    }

    async setLang(id, lang)
    {
        await this.pool.query(`
                update users
                set lang = $1
                where id = $2
            `, [
                lang, id
            ]);
    }

    async getUser(id)
    {
        const user = await this.pool.query(`
                select id, username, first_name, last_name, lang
                from users
                where id = $1
            `, [id]);

        return user.rows.length ? user.rows[0] : null;
    }

    async getMedia(userId, fileUid)
    {
        const media = await this.pool.query(`
                select id, user_id, type, file_uid, file_id, add_dt
                from media_of_users
                where user_id = $1
                and file_uid = $2
            `, [
                userId, fileUid
            ]);

        return media.rows.length ? media.rows[0] : null;
    }

    async getMediaTags(id)
    {
        const tags = await this.pool.query(`
                select t.tag
                from tags t
                join tags_of_media tm
                on tm.tag_id = t.id
                where tm.media_id = $1
                order by tag
            `, [id]);

        return tags.rows.map(t => t.tag);
    }

    async addMedia(userId, type, fileUid, fileId, tags)
    {
        const media = await this.pool.query(`
                insert into media_of_users (user_id, type, file_uid, file_id)
                values ($1, $2, $3, $4)
                on conflict do nothing
                returning id, add_dt
            `, [
                userId, type, fileUid, fileId
            ]);

        for (let tag of tags) {
            tag = await this._addTag(tag);

            await this.pool.query(`
                    insert into tags_of_media (media_id, tag_id)
                    values ($1, $2)
                    on conflict do nothing
                `, [
                    media.rows[0].id, tag.id
                ]);
        }
    }

    async remMedia(id)
    {
        await this.pool.query(`
                delete from media_of_users
                where id = $1
            `, [id]);
    }

    async editMedia(id, tags)
    {
        await this.pool.query(`
                delete from tags_of_media
                where media_id = $1
            `, [id]);

        for (let tag of tags) {
            tag = await this._addTag(tag);

            await this.pool.query(`
                    insert into tags_of_media (media_id, tag_id)
                    values ($1, $2)
                    on conflict do nothing
                `, [
                    id, tag.id
                ]);
        }
    }

    async addMediaTags(id, tags)
    {
        for (let tag of tags) {
            tag = await this._addTag(tag);

            await this.pool.query(`
                    insert into tags_of_media (media_id, tag_id)
                    values ($1, $2)
                    on conflict do nothing
                `, [
                    id, tag.id
                ]);
        }
    }

    async remMediaTags(id, tags)
    {
        for (let tag of tags) {
            tag = await this._addTag(tag);

            await this.pool.query(`
                    delete from tags_of_media
                    where media_id = $1
                    and tag_id = $2
                `, [
                    id, tag.id
                ]);
        }
    }

    async replaceTag(oldTag, newTag)
    {
        const replacement = await this._addTag(newTag);

        await this.pool.query(`
                update tags_of_media
                set tag_id = $1
                where tag_id = (
                    select id
                    from tags
                    where tag = $2
                )
            `, [
                replacement.id, oldTag
            ]);
    }

    async getAllMedias(userId, limit)
    {
        const medias = await this.pool.query(`
                select type, file_id, file_uid, add_dt
                from media_of_users
                where user_id = $1
                order by last_use_dt desc
                limit $2
            `, [
                userId, limit
            ]);

        return medias.rows;
    }

    async findMedias(userId, tags, limit)
    {
        const medias = await this.pool.query(`
                select mu.type, mu.file_id, mu.file_uid, mu.add_dt
                from media_of_users mu
                join tags_of_media tm
                on tm.media_id = mu.id
                join tags t
                on t.id = tm.tag_id
                where mu.user_id = $1
                and t.tag = any($2::varchar[])
                group by mu.id
                having count(t.tag) = $3
                order by last_use_dt desc
                limit $4
            `, [
                userId, tags, tags.length, limit
            ]);

        return medias.rows;
    }

    async useMedia(userId, fileUid)
    {
        await this.pool.query(`
                update media_of_users
                set last_use_dt = current_timestamp
                where user_id = $1
                and file_uid = $2
            `, [
                userId, fileUid
            ]);
    }

    async getStats(userId)
    {
        const mediaCount = await this.pool.query(`
                select type, count(*) as count
                from media_of_users
                where user_id = $1
                group by type
            `, [userId]);

        let nMedias = {};
        for (let row of mediaCount.rows) {
            nMedias[row.type] = parseInt(row.count);
        }

        const startDate = await this.pool.query(`
                select add_dt
                from media_of_users
                where user_id = $1
                order by add_dt
                limit 1
            `, [userId]);

        const tags = await this.pool.query(`
                select t.tag, count(tm.*) as count
                from tags t
                join tags_of_media tm
                on tm.tag_id = t.id
                join media_of_users mu
                on mu.id = tm.media_id
                where mu.user_id = $1
                group by t.id
                order by count desc
            `, [userId]);

        let sum = 0;
        for (let tag of tags.rows) {
            sum += parseInt(tag.count);
        }

        let res = {
            n_images: nMedias.photo     || 0,
            n_gifs:   nMedias.animation || 0,
            n_videos: nMedias.video     || 0,
            n_tags:   tags.rows.length,

            start_date: startDate.rows.length ? startDate.rows[0].add_dt : 0,

            most_used_tags: tags.rows.map(r => r.tag).slice(0, config.maxNStatsTags)
        };

        res.n_medias = res.n_images + res.n_gifs + res.n_videos;
        res.avg_tags = sum / res.n_medias || 0;

        return res;
    }
}




module.exports = new DBHelper();
