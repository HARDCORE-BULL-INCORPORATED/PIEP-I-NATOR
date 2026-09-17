# Single-container deployment

The image bundles the Lavalink jar, and the bot runs it as a
[local node](https://musicdisc.ggwp.tw/docs/Configuration-description#local-lavalink-node).
One container runs everything: the bot, Lavalink, and the web dashboard.

The image is built on the server from this repository. Nothing is pulled from a
container registry.

## Directory layout on the VPS

```
~/Music-Disc/              # git clone of this fork
├── Dockerfile             # bundles Lavalink (LAVALINK_VERSION)
└── deploy/
    ├── docker-compose.yml
    ├── .env               # BOT_TOKEN and TZ
    ├── application.yml    # Lavalink config (not in git: contains the YouTube OAuth token)
    ├── data/              # Bot SQLite database (playlists, queue persistence)
    ├── logs/              # Bot logs
    └── lavalink/
        ├── plugins/       # Lavalink plugins (downloaded on first start)
        └── logs/          # Lavalink logs
```

## First-time setup

```bash
git clone https://github.com/Varjovaras/Music-Disc.git ~/Music-Disc
cd ~/Music-Disc/deploy
cp .env.example .env          # then edit BOT_TOKEN
cp ~/lava/application.yml .   # reuse the existing Lavalink config
docker compose up -d --build
docker compose logs -f
```

`application.yml` must exist before the first start, otherwise Docker creates a
directory with that name.

The first build takes several minutes (dashboard build, TypeScript compile, native
module build); later builds reuse Docker's layer cache. The VPS needs roughly 2 GB
of free RAM for the build.

Stop the old standalone Lavalink service; the container now runs its own node.

## Automatic deployment

[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) deploys on every push to
`main`: it SSHes into the VPS, runs `git pull --ff-only` in the clone, and then
`docker compose up -d --build`. The build still happens on the server.

Add these repository secrets (Settings → Secrets and variables → Actions):

| Secret        | Value                                                                            |
| ------------- | -------------------------------------------------------------------------------- |
| `VPS_HOST`    | Server hostname or IP                                                            |
| `VPS_USER`    | SSH user, e.g. `kristjan`                                                        |
| `VPS_SSH_KEY` | Private key (ED25519) whose public key is in the VPS `~/.ssh/authorized_keys`    |
| `VPS_DIR`     | Path of the clone on the server, e.g. `/home/kristjan/Music-Disc`                |
| `VPS_PORT`    | Optional SSH port, defaults to `22`                                              |

Until `VPS_HOST` is set, the deploy step is skipped. You can also start a deploy by
hand from the Actions tab (`workflow_dispatch`).

The deploy runs `git pull --ff-only`, so keep the clone clean: don't edit tracked
files (like `config.js`) on the server, commit and push instead. `application.yml`
and the data directories are gitignored and are never touched by a deploy.

## Updating

With the workflow configured above, updates happen automatically on push. To do it by
hand:

```bash
cd ~/Music-Disc
git pull
cd deploy
docker compose up -d --build
```

`config.js` (bot settings) is baked into the image, so a rebuild applies changes.

`application.yml` (Lavalink config) is not part of the image; edit it on the server
and restart:

```bash
docker compose restart
```

To move to another Lavalink version, bump `LAVALINK_VERSION` in the `Dockerfile`
and the `localNode.downloadLink` version in `config.js` together, then rebuild.
If the two versions differ, the bot re-downloads the jar on startup instead of
using the bundled one.

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
