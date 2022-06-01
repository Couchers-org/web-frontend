# Couchers Web Frontend

This is the react/nextjs web frontend for couchers.org. We are using Typescript with [React Query](https://react-query.tanstack.com/) for data fetching and [Material UI](https://material-ui.com/) for components.

Communication with the backend is via [protobuf messages](https://github.com/protocolbuffers/protobuf/tree/master/js) and [grpc-web](https://github.com/grpc/grpc-web). You can find some helpful documentation on [protobuf messages in javascript here](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated).

## Setup

- Install [the GitHub Desktop App](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/installing-and-authenticating-to-github-desktop/installing-github-desktop) (or alternatively, the [git CLI](https://git-scm.com/). This varies by platform but on Mac/Linux you should use a package manager.)
- Install docker and docker compose
  - It's recommended you install [Docker Desktop](https://www.docker.com/products/docker-desktop/) as it includes both.
  - If you don't want docker desktop, you can follow [these instructions](https://docs.docker.com/compose/install/) to install docker compose.
- Install an editor of your choice. Good examples are [Atom]() or [Visual Studio Code]() which both have extensions for Typescript/Javascript etc.
- Clone this repository with `git clone https://github.com/Couchers-org/web-frontend.git`

## Setting up the dev environment

It is recommended that while running the frontend locally, you target the hosted dev API and backend - this is the default behaviour. If you'd like to run the backend locally too, see the note below.

A makefile is provided which will run the frontend in docker-compose, using your local source code. In general you'll need to run these commands to get started:
_Windows users: you may need to install [MinGW](https://www.mingw-w64.org/) for some commands to work properly._

- `make build` - Build the docker image for running the frontend
- `make run` - Launch the frontend in docker-compose and attach to logs
- `make stop` - Stop running containers

Other commands:

| Command | Description |
| --- | --- |
| `make build` | Build docker images using layer cache etc. |
| `make rebuild` | Completely rebuild docker images. |
| `make logs` | (Re)Attach to the docker-compose logs. |
| `make shell` | Open an interactive shell in the main web-frontent container. |
| `make run-foreground` | Run the docker images without detaching. |

_**Note:** The frontend might take a while to start up the first time you `make run`. This is because it runs `yarn install` at runtime, so that dependencies are always up to date._


#### Run the backend, proxy and database locally

You can run _everything_ locally if you like - [follow the main instructions](https://github.com/Couchers-org/couchers/blob/develop/app/readme.md) to start the docker containers and generate the protocol buffer code.

Then, you just need to rename `.env.localdev` in the repo root to `.env.local`. Then you can run the frontend normally as described above, and it will target the local backend. Remember not to commit the renamed file!

_hint_: You can find a set of users for logging in at the [dummy data loaded in the docker container](https://github.com/Couchers-org/couchers/blob/develop/app/backend/src/data/dummy_users.json)

## How to contribute

1. Pick an unassigned issue you'd like to work on (or open a new one) and assign it to yourself.

2. Make sure you have the development environment going (see above).

3. Create a new branch for your issue under 'web/issue-type/branch-name' eg. `web/feature/global-search`, `web/bug/no-duplicate-users` or `web/refactor/fix-host-requests`

4. Do some code! It is good to commit regularly, but if possible your code should successfully compile with each commit.

5. Create a pull request and request a code review from someone. It can be good to open a PR before you are finished, make it a draft PR in that case.

6. Listen to the feedback and make any necessary changes. Remember, code review can sometimes seem very direct if your are not accustomed to it, but we are all learning and all comments are intended to be kind and constructive. :)

7. Remember to also get review on your post-review changes.

8. Once everything is resolved, you can merge the PR if you feel confident, or ask someone to merge for you. If there are merge conflicts, merge the base branch (probably `develop`) into your branch first, and make sure everything is still okay.
