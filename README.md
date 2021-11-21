# Telegram Booru
*Maybe you meant: Unlimited Telegram Gallery*

> A builtin personal inline booru for [Telegram](https://telegram.org).

![](https://img.shields.io/tokei/lines/github/arebaka/tgbooru)
![](https://img.shields.io/github/repo-size/arebaka/tgbooru)
![](https://img.shields.io/npm/v/tgbooru)
![](https://img.shields.io/codefactor/grade/github/arebaka/tgbooru)

![](https://img.shields.io/badge/English-100%25-brightgreen)
![](https://img.shields.io/badge/Russian-100%25-brightgreen)

![demo](https://user-images.githubusercontent.com/36796676/142752828-0855a992-0faf-4f7d-993f-4785e404206f.png)
![demo](https://user-images.githubusercontent.com/36796676/142752844-683a1afe-f338-4c58-9f08-ec78e39c9886.png)

## Commands
`/help` – display all commands  
`/lang` – change the language bot speaks  
`/add <tags...>` – add a media to your booru  
`/delete` – delete the media from your booru  
`/info` – display some information about the media  
`/replace <tags...>` – replace all tags of the media  
`/addtag <tags...>` – add one or more tags of the media  
`/deltag <tags...>` – remove one or more tags from the media  
`/edittag <old> <new>` – replace the any tag everywhere  
`/stats` – display your summary

## Supported media types
+ 🖼️ photo
+ 📹 GIF
+ 🎬 video

## TLDR
1. Create and setup a bot via [@BotFather](https://t.me/BotFather)
2. Install [PostgreSQL](https://www.postgresql.org/download/) if you didnt
3. Create an empty database 'tgbooru' in PSQL owned to your user
4. Install [npm](https://www.npmjs.com) & [node.js](https://npmjs.com/package/node)
5. `npm i tgbooru`
6. `export TOKEN=<TOKEN_FROM_BOTFATHER>`
7. `npx tgbooru`
8. To stop the bot type to console with it `stop` and press enter

## Preparing
1. Create your bot via [@BotFather](https://t.me/BotFather), it will guide you on that
2. The bot uses DBMS PostgreSQL. [Install](https://www.postgresql.org/download/) if you dont have it
3. Create a database in PSQL for you bot
4. The bot works using [node.js](https://npmjs.com/package/node). Install it

## Installation
```bash
npm i tgbooru
```

## Launch
The bot requires some environment variables. Here is a list of them:  
`TOKEN` – bot token from @BotFather  
`DBURI` – URI-string for connection to PSQL in format `postgres://<USER>:<PASSWORD>@<HOST>/<DATABASE>:<PORT>`

Instead of the environment you can set launch parameters in a file `config.toml`.

After setup the environment run
```bash
npx tgbooru
```

If everything went well, you will see something like this in the console:
```
> tgbooru@1.0.0 start
> node index.js

Bot @myboorubot started.
> _
```

## Control
After the launch, there are available commands `stop` & `reload` for safe stop and restart respectively.

## Usage
To see how the bot works, you can refer to [@myboorubot](https://t.me/myboorubot).  
So far, the bot doesnt use any query language, just returning media with all given tags.

## Support
If something doesnt work, or you just wanna talk to the bot creator or his mom, write [@arelive](https://t.me/arelive). There also accepted kicks from volunteer project managers.
