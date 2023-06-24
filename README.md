# 📖 Selfhost Instructions

The `example` prefix is added to the configuration files to avoid leaking private information. You will need to copy those over first:

- `cp src/example.config.json src/config.json`
- `cp src/example.discloud.config src/discloud.config`

Once those files are filled using `nano <file path>`, start the bot using `docker compose up -d`.
