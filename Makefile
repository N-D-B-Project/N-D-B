.PHONY: *

TAG_OR_COMMIT := $(shell git describe --tags --always)
DOCKER_REGISTRY = ghcr.io
IMAGE_NAME = $(DOCKER_REGISTRY)/N-D-B-Project/N-D-B
CONTAINER_BOT = bot

install:
	@yarn install

prisma:
	@yarn prisma generate
	@yarn prisma migrate dev

setup:
	@$(MAKE) install
	@$(MAKE) prisma

build:
	@yarn build

start:
	@$(MAKE) setup
	@$(MAKE) build
	@yarn start

start-dev:
	@$(MAKE) setup
	@yarn start:dev

restart:
	@docker restart ndbase
	@docker restart bot

logs-prod:
	@docker compose -f docker-compose.prod.yml logs -f

logs-dev:
	@docker compose -f docker-compose.dev.yml logs -f
