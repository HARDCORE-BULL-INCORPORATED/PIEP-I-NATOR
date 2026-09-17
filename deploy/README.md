# Single-container deployment

The image built by this fork bundles the Lavalink jar, and the bot runs it as a
[local node](https://musicdisc.ggwp.tw/docs/Configuration-description#local-lavalink-node).
That means one container runs everything: the bot, Lavalink, and the web dashboard.

* Bot image: `ghcr.io/varjovaras/music-disc:latest`
* Built by [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) on every push to `main`
* Lavalink version is set with `LAVALINK_VERSION` in the [Dockerfile](../Dockerfile)

## Directory layout on the VPS

```
~/music-disc/
├── docker-compose.yml
├── .env                 # BOT_TOKEN and TZ
├── application.yml      # Lavalink config (kept out of git: contains the YouTube OAuth token)
├── data/                # Bot SQLite database (playlists, queue persistence)
├── logs/                # Bot logs
└── lavalink/
    ├── plugins/         # Lavalink plugins (downloaded on first start)
    └── logs/            # Lavalink logs
```

## First-time setup

1. Create the directory and copy the files over:

   ```bash
   mkdir -p ~/music-disc && cd ~/music-disc
   # from a clone of this repository
   cp deploy/docker-compose.yml .
   cp deploy/.env.example .env       # then edit BOT_TOKEN
   cp ~/lava/application.yml .       # reuse the existing Lavalink config
   ```

   `application.yml` must exist before the first start, otherwise Docker creates a
   directory with that name.

2. Start the container:

   ```bash
   docker compose up -d
   docker compose logs -f
   ```

3. Stop the old standalone Lavalink service; the container now runs its own node.

## Automatic deployment

Add these repository secrets (Settings → Secrets and variables → Actions):

| Secret        | Value                                                                     |
| ------------- | ------------------------------------------------------------------------- |
| `VPS_HOST`    | Server hostname or IP                                                     |
| `VPS_USER`    | SSH user, e.g. `kristjan`                                                 |
| `VPS_SSH_KEY` | Private key (ED25519) whose public key is in the VPS `~/.ssh/authorized_keys` |
| `VPS_DIR`     | Deployment directory, e.g. `/home/kristjan/music-disc`                    |
| `VPS_PORT`    | Optional SSH port, defaults to `22`                                       |

While `VPS_HOST` is unset, the deploy step is skipped and only the image is published.

### Pulling the image on the VPS

GHCR packages are private by default. Either:

* make the package public: GitHub → profile → Packages → `music-disc` → Package settings → Change visibility → Public, or
* log in once on the VPS with a personal access token that has `read:packages`:

  ```bash
  echo <TOKEN> | docker login ghcr.io -u Varjovaras --password-stdin
  ```

## Updating

* **Bot code / settings**: edit `config.js` in this repository and push to `main`. The
  workflow rebuilds the image and deploys it. `config.js` is baked into the image, so
  changes on the VPS would be overwritten.
* **Lavalink config**: edit `application.yml` on the VPS and restart:

  ```bash
  docker compose restart
  ```

* **Lavalink version**: bump `LAVALINK_VERSION` in the `Dockerfile` and the
  `localNode.downloadLink` version in `config.js` together, then push. If the two
  versions differ, the bot re-downloads the jar on startup instead of using the
  bundled one.

## Notes

* `config.js` contains the dashboard credentials. Change `bot.webDashboard.user.password`
  from the default and be aware that the file (and therefore the password) is public
  in this repository. If you do not want to expose the dashboard, remove the `ports`
  entry and reach it through an SSH tunnel: `ssh -L 33333:localhost:33333 <user>@<host>`.
* The YouTube plugin is downloaded from maven on the first Lavalink start into
  `lavalink/plugins`; it needs outbound network access.
* `plugins.youtube.remoteCipher` points at an external cipher service, so no
  `yt-cipher` container is needed.
* The container runs as root, so files created in the mounted directories are owned
  by root on the host.
