FROM oven/bun:1.4.2-slim AS bun_build

WORKDIR /tmp

COPY . .

RUN bun install --frozen-lockfile && \
    bun install --frozen-lockfile --cwd ./dashboard && \
    bun run build


############################################################

FROM alpine:3.21 AS lavalink

ARG LAVALINK_VERSION=4.2.2

RUN apk add --no-cache ca-certificates && \
    wget -q -O /Lavalink.jar \
    "https://github.com/lavalink-devs/Lavalink/releases/download/${LAVALINK_VERSION}/Lavalink.jar" && \
    test -s /Lavalink.jar


############################################################

FROM oven/bun:1.4.2-slim

WORKDIR /bot

RUN apt-get update && \
    apt-get install --no-install-recommends -y openjdk-21-jre-headless && \
    rm -rf /var/lib/apt/lists/*


COPY --from=bun_build /tmp/node_modules ./node_modules
COPY --from=bun_build /tmp/src ./src
COPY --from=bun_build /tmp/server ./server
COPY --from=bun_build /tmp/dashboard/.output/public ./dashboard/.output/public

COPY --from=lavalink /Lavalink.jar ./server/Lavalink.jar

COPY --from=bun_build /tmp/package.json /tmp/bun.lock ./
COPY --from=bun_build /tmp/config.js ./


ENTRYPOINT ["bun", "./src/index.ts"]
