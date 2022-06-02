.PHONY: remove-docker-image build rebuild run start run-background run-foreground stop logs shell

DOCKER_COMMAND := $(shell docker-compose -v > /dev/null 2>&1; \
							            if [ $$? -eq 0 ]; then \
							            	echo "docker-compose"; \
													else \
														docker-compose -v > /dev/null 2>&1; \
							            	if [ $$? -eq 0 ]; then \
							              	echo "docker compose"; \
														fi; \
													fi;)

deps:
ifndef DOCKER_COMMAND
	@echo "Docker compose not found. Please install either docker-compose (the tool) or the docker compose plugin."
	exit 1
endif

# Remove docker image
remove-docker-image: deps
	$(DOCKER_COMMAND) down

# This will simply build, which should re-use layer caches and such
build: deps
	tar -xf proto_may_27_2022.tar.gz
	docker volume create nodemodules
	$(DOCKER_COMMAND) build
	$(DOCKER_COMMAND) run --rm install

# This will completely rebuild the docker image
rebuild: remove-docker-image build

# This is our default logic for "make run" or "make start", to use the backgrounded
run: run-background logs
start: run-background logs

# This will run a dev-friendly (backgrounded) version of our app in dev mode
# NOTE: Re-run this to update the container if you changed the docker compose
#       Or re-run build if you changes the package.json dependencies
run-background: deps
	$(DOCKER_COMMAND) up -d web-frontend

# This will run a dev-friendly (foregrounded) version of our app in dev mode
# NOTE: Re-run this to update the container if you changed the docker compose
#       Or re-run build if you changes the package.json dependencies
run-foreground: deps
	$(DOCKER_COMMAND) up web-frontend

# This is to stop
stop: deps
	$(DOCKER_COMMAND) stop

# This will view the logs
logs: deps
	$(DOCKER_COMMAND) logs -f

# This will shell you into the running web container
shell: deps
	docker exec -ti couchers-frontend-new_web-frontend_1 /bin/sh
