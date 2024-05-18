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

file-mode:
	@echo "Configuring git fileMode to false"
	git config core.fileMode false

setup:
	@$(MAKE) install
	@$(MAKE) prisma

build:
	@yarn build

start:
	@$(MAKE) setup
	@$(MAKE) build
	@yarn start
