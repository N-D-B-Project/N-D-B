FROM ghcr.io/lavalink-devs/lavalink:4

RUN adduser --system --no-create-home --disabled-password --disabled-login --group lavalink
RUN usermod -u 999 lavalink

COPY application.yml /opt/Lavalink/application.yml
COPY plugins/ /opt/Lavalink/plugins/

USER lavalink
