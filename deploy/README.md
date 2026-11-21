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
├── config.js              # Bot config (not in git: contains the dashboard credentials)
├── server/
│   └── plugins/           # Lavalink plugins (Soundy is committed here)
└── deploy/
    ├── docker-compose.yml
    ├── .env               # BOT_TOKEN and TZ
    ├── application.yml    # Lavalink config (not in git: contains the YouTube OAuth token)
    ├── data/              # Bot SQLite database (playlists, queue persistence)
    ├── logs/              # Bot logs
    └── lavalink/
        └── logs/          # Lavalink logs
```

## First-time setup

```bash
git clone https://github.com/Varjovaras/Music-Disc.git ~/Music-Disc
cd ~/Music-Disc
cp config.example.js config.js  # then edit: Lavalink node, dashboard credentials
cd deploy
cp .env.example .env            # then edit BOT_TOKEN
cp ~/lava/application.yml .   # reuse the existing Lavalink config
docker compose up -d --build
docker compose logs -f
```

`application.yml` must exist before the first start, otherwise Docker creates a
directory with that name.

The first build takes several minutes (Bun install and dashboard build); later
builds reuse Docker's layer cache. The VPS needs roughly 2 GB of free RAM for the
build.

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
files on the server, commit and push instead. `config.js`, `application.yml`, and
the data directories are gitignored and are never touched by a deploy.

## Updating

With the workflow configured above, updates happen automatically on push. To do it by
hand:

```bash
cd ~/Music-Disc
git pull
cd deploy
docker compose up -d --build
```

`config.js` (bot settings) is not in git. It is baked into the image, so edit it
on the server (first time: `cp config.example.js config.js`) and rebuild to apply
changes.

`application.yml` (Lavalink config) is not part of the image; edit it on the server
and restart:

```bash
docker compose restart
```

To move to another Lavalink version, bump `LAVALINK_VERSION` in the `Dockerfile`
and the `localNode.downloadLink` version in `config.js` together, then rebuild.
If the two versions differ, the bot re-downloads the jar on startup instead of
using the bundled one.

## SoundCloud

The committed `server/plugins/soundy-plugin-1.1.1.jar` replaces Lavalink's
built-in SoundCloud source.

`deploy/docker-compose.yml` enables Soundy and disables the built-in source with
environment overrides, so the server's gitignored `application.yml` does not
need to be edited. The equivalent YAML is:

```yaml
lavalink:
  server:
    sources:
      soundcloud: false

plugins:
  soundy:
    enabled: true
```

Redeploy with `docker compose up -d --build` so the plugin mount and environment
overrides take effect.

## Notes

* `config.js` is gitignored and holds the dashboard credentials. Set a strong
  `bot.webDashboard.user.password`. If you do not want to expose the dashboard,
  remove the `ports` entry and reach it through an SSH tunnel:
  `ssh -L 33333:localhost:33333 <user>@<host>`.
* `server/plugins` is mounted into the container. Soundy is committed there;
  the YouTube plugin is downloaded from Maven on the first Lavalink start and
  needs outbound network access. `deploy/lavalink/plugins` is no longer used.
* SoundCloud is handled by the committed soundy-plugin; the built-in source is
  disabled by the compose environment overrides (and in `server/application.yml`).
* `plugins.youtube.remoteCipher` points at an external cipher service, so no
  `yt-cipher` container is needed.
* The container runs as root, so files created in the mounted directories are owned
  by root on the host.
