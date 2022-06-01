.PHONY: remove-docker-image build rebuild run start run-background run-foreground stop logs shell

.DEFAULT_GOAL := help

# Remove docker image
remove-docker-image:
	docker-compose down

# This will simply build, which should re-use layer caches and such
build:
	tar -xf proto_may_27_2022.tar.gz
	docker-compose build

# This will completely rebuild the docker image
rebuild: remove-docker-image build

# This is our default logic for "make run" or "make start", to use the backgrounded
run: run-background logs
start: run-background logs

# This will run a dev-friendly (backgrounded) version of our app in dev mode
# NOTE: Re-run this to update the container if you changed the docker compose
#       Or re-run build if you changes the package.json dependencies
run-background:
	docker-compose up -d

# This will run a dev-friendly (foregrounded) version of our app in dev mode
# NOTE: Re-run this to update the container if you changed the docker compose
#       Or re-run build if you changes the package.json dependencies
run-foreground:
	docker-compose up

# This is to stop
stop:
	docker-compose stop

# This will view the logs
logs:
	docker-compose logs -f

# This will shell you into the running web container
shell:
	docker exec -ti couchers-frontend-new_web-frontend_1 /bin/sh
