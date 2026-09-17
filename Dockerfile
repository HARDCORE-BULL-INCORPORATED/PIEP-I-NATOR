FROM node:22.22.3-slim AS node_build

WORKDIR /tmp

RUN apt-get update && \
    apt-get install --no-install-recommends -y g++ make python3

COPY . .

RUN npm ci && \
    npm --prefix ./dashboard ci && \
    npm run build


############################################################

FROM alpine:3.21 AS lavalink

ARG LAVALINK_VERSION=4.2.2

RUN apk add --no-cache ca-certificates && \
    wget -q -O /Lavalink.jar \
    "https://github.com/lavalink-devs/Lavalink/releases/download/${LAVALINK_VERSION}/Lavalink.jar" && \
    test -s /Lavalink.jar


############################################################

FROM node:22.22.3-slim

WORKDIR /bot

RUN apt-get update && \
    apt-get install --no-install-recommends -y openjdk-17-jre-headless && \
    rm -rf /var/lib/apt/lists/*


COPY --from=node_build /tmp/dist ./dist
COPY --from=node_build /tmp/node_modules ./node_modules
COPY --from=node_build /tmp/server ./server
COPY --from=node_build /tmp/dashboard/.output/public ./dashboard/.output/public

COPY --from=lavalink /Lavalink.jar ./server/Lavalink.jar

COPY --from=node_build /tmp/package*.json ./
COPY --from=node_build /tmp/config.js ./


ENTRYPOINT ["npm", "run", "start:server"]
