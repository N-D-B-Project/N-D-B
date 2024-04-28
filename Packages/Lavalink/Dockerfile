FROM ghcr.io/lavalink-devs/lavalink:4.0.4

USER root

RUN adduser --system --no-create-home --disabled-password --disabled-login --group lavalink \
  && usermod -u 999 lavalink

COPY application.yml /opt/Lavalink/application.yml
COPY plugins/ /opt/Lavalink/plugins/

USER lavalink
