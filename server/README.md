# Lavalink Server Configuration


## 1. youtube-source

`yt-cipher` handles signature deciphering for YouTube playback URLs. Do not remove the `yt-cipher` service or the `plugins.youtube.remoteCipher` configuration.  

Configure the latest `youtube-source` plugin in `application.yml`:

```yaml
lavalink:
  plugins:
    - dependency: "dev.lavalink.youtube:youtube-plugin:1.18.2"
      snapshot: false
```

Check the [Releases](https://github.com/lavalink-devs/youtube-source/releases) page for newer versions before deployment.

Disable Lavalink's built-in YouTube source:

```yaml
lavalink:
  server:
    sources:
      youtube: false
```

YouTube requests will then be handled by the `youtube-source` plugin.

---

## 2. SoundCloud (soundy-plugin)

SoundCloud now serves fragmented MP4/AAC HLS streams, which Lavalink's built-in
SoundCloud source cannot decode. [soundy-plugin](https://github.com/lpaiu-cs/soundy-plugin)
replaces it.

The plugin jar is committed at `server/plugins/soundy-plugin-1.1.1.jar` (MIT,
SHA-256 `1fd0c2f41f214ffb8b33fe744584b1efbbe14edbd31ef7c4cb73f7fd4df4f5ac`).
Lavalink loads it from the `plugins` directory automatically. Do not add it to
`lavalink.plugins`: Soundy is not published to a Maven repository that Lavalink
can download from.

Disable the built-in source and enable the plugin:

```yaml
lavalink:
  server:
    sources:
      soundcloud: false

plugins:
  soundy:
    enabled: true
```

Soundy handles tracks, sets/playlists, likes, short links, and `scsearch:`. To
update it, replace the jar with a newer release from the
[Releases](https://github.com/lpaiu-cs/soundy-plugin/releases) page and restart
Lavalink. Keep exactly one `soundy-plugin-*.jar` in `server/plugins`.

---

## 3. yt-cipher

### application.yml

Update `plugins.youtube.remoteCipher`:

```yaml
plugins:
  youtube:
    enabled: true
    remoteCipher:
      url: "http://yt-cipher:8001"
      password: "yt-cipher-token"
      userAgent: "lavalink"
```

The `url` must use the Docker Compose service name `yt-cipher` and container port `8001`. Do not use `localhost` or the host port.

### docker-compose.yml

Configure the `yt-cipher` service:

```yaml
services:
  yt-cipher:
    image: ghcr.io/kikkia/yt-cipher:master
    container_name: yt-cipher
    restart: always
    environment:
      - API_TOKEN=yt-cipher-token
      - OVERRIDE_PLAYER_VARIANT=IAS
    networks:
      - lavalink
    ports:
      - "8001:8001"
```

These two values must match exactly:

```text
plugins.youtube.remoteCipher.password = yt-cipher.environment.API_TOKEN
```

The current example value is:

```text
yt-cipher-token
```

---

## 4. YouTube OAuth refreshToken

Set a `refreshToken`. Without one, YouTube is more likely to classify requests as automated or bot traffic.

```yaml
plugins:
  youtube:
    oauth:
      enabled: true
      refreshToken: "your-refresh-token"
```

To obtain a refresh token for the first time:

1. Keep `enabled: true`.
2. Temporarily comment out `refreshToken`.
3. Start Lavalink.
4. Check the logs and complete the OAuth authorization flow.
5. Copy the refresh token from the logs into `application.yml`.
6. Restart Lavalink.

```bash
docker compose logs -f lavalink
```

Use a dedicated YouTube account instead of your primary account. OAuth requests may still be rate-limited or restricted.  
Requesting too often could get your account banned. **It’s better to use an idle YouTube account or create a new one.**  

---

## 5. Docker ports

Format:

```yaml
ports:
  - "<host port>:<container port>"
```

* `host port`: The port exposed on the Docker host.
* `container port`: The port used by the service inside the container.

Change only the `host port` when possible. Keep the `container port` at the service default. This makes the configuration easier to manage and keeps container-to-container connections unchanged.

Current configuration:

```yaml
services:
  yt-cipher:
    ports:
      - "8001:8001"

  lavalink:
    ports:
      - "8333:2333"
```

If a host port conflicts with another service, change only the value on the left:

```yaml
services:
  yt-cipher:
    ports:
      - "18001:8001"

  lavalink:
    ports:
      - "18333:2333"
```

Internal container connections remain unchanged:

```text
Lavalink -> http://yt-cipher:8001
Lavalink container port -> 2333
```

Each service must use a unique host port. Docker will fail to start if multiple services bind to the same host port.

---

## 6. Start the services

```bash
docker compose pull
docker compose up -d
docker compose ps
```

View logs:

```bash
docker compose logs -f lavalink
```

```bash
docker compose logs -f yt-cipher
```

---
