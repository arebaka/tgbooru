CREATE TYPE media_type as ENUM (
    'photo',
    'animation',
    'video'
);

CREATE TABLE IF NOT EXISTS public.users (
    id bigint NOT NULL PRIMARY KEY,
    username character varying(32) DEFAULT NULL::character varying,
    first_name character varying(256) NOT NULL,
    last_name character varying(256) DEFAULT NULL::character varying,
    lang CHARACTER(3) DEFAULT 'eng' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tags (
    id bigserial NOT NULL PRIMARY KEY,
    tag char varying(4096) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.media_of_users (
    id bigserial NOT NULL PRIMARY key,
    user_id bigint NOT NULL,
    type media_type NOT NULL,
    file_uid character varying(32) NOT NULL,
    file_id character varying(128) NOT NULL,
    add_dt timestamp without time zone DEFAULT current_timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tags_of_media (
    id bigserial NOT NULL PRIMARY KEY,
    media_id bigint NOT NULL,
    tag_id bigint NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS tags_tag_uindex       ON public.tags          USING btree (tag);
CREATE UNIQUE INDEX IF NOT EXISTS media_of_users_uindex ON public.tags_of_media USING btree (user_id, media_id);
CREATE UNIQUE INDEX IF NOT EXISTS tags_of_media_uindex  ON public.tags_of_media USING btree (media_id, tag_id);

CREATE INDEX IF NOT EXISTS users_username_index          ON public.users          USING btree (username);
CREATE INDEX IF NOT EXISTS users_first_name_index        ON public.users          USING btree (first_name);
CREATE INDEX IF NOT EXISTS users_last_name_index         ON public.users          USING btree (last_name);
CREATE INDEX IF NOT EXISTS media_of_users_file_uid_index ON public.media_of_users USING btree (file_uid);
CREATE INDEX IF NOT EXISTS media_of_users_file_id_index  ON public.media_of_users USING btree (file_id);
CREATE INDEX IF NOT EXISTS media_of_users_add_dt_index   ON public.media_of_users USING btree (add_dt);

ALTER TABLE public.media_of_users ADD CONSTRAINT media_of_users_user_id_fkey FOREIGN KEY (user_id)  REFERENCES public.users(id)          ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.tags_of_media  ADD CONSTRAINT tags_of_media_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media_of_users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE public.tags_of_media  ADD CONSTRAINT tags_of_media_tag_id_fkey   FOREIGN KEY (tag_id)   REFERENCES public.tags(id)           ON UPDATE CASCADE ON DELETE CASCADE;
