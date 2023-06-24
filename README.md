# 📖 Selfhost Instructions
⚠️ This guide is made for Ubuntu

## 🤖 Bot
- Visit the [Discord Developers Portal](https://discord.com/developers/applications) and click the "New Application" button
- Visit the bot tab and select all the privileged gateway intents
- Reset and copy the bot token

## ⚙️ Required
- [Docker](https://docs.docker.com/engine/install/ubuntu/)

## 💻 Setup
The `example` prefix is added to the configuration files to avoid leaking private information. You will need to copy those over first:

- `cp src/example.config.json src/config.json`
- `cp src/example.discloud.config src/discloud.config`

Once those files are filled using `nano <file path>`, start the bot using `docker compose up -d`.
