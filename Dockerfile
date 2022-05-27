####################################################################
# Multi-Stage Docker Image for Couchers Frontend with Next.js
#
# Taken bits for this Dockerfile from various places, for next.js from here
#      See: https://www.koyeb.com/tutorials/how-to-dockerize-and-deploy-a-next-js-application-on-koyeb
#
#  Original Author: Farley
####################################################################

ARG BUILD_FOR_ENVIRONMENT=development
# ARG NODE_ENV=production
ARG BUILD_IMAGE=node:14-buster
ARG RUNTIME_IMAGE=node:14-slim

###################################
# First, using a NodeJS builder container build our frontend assets
FROM $BUILD_IMAGE as builder

# Setup
# NOTE/TODO: OUR CODE CURRENTLY REQUIRES DEVELOPMENT PACKAGE INSTALLS, PLEASE FIX ME...
# ARG NODE_ENV=development
WORKDIR /app

# Install deps for layer caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Now copy the source code and build when needed against the env type
ARG BUILD_FOR_ENVIRONMENT
COPY . .
# And add our pre-compiled protos since we won't be updating our backend any more
ADD http://couchers-dev-assets.s3.amazonaws.com/proto_may_27_2022.tar.gz /app/

# Expand our protos into place, set the right env vars into place, then build our static assets
RUN tar -xf proto_may_27_2022.tar.gz && \
    rm -f proto_may_27_2022.tar.gz && \
    cp .env.${BUILD_FOR_ENVIRONMENT} /tmp/saved-temporarily && \
    rm .env.* && \
    mv /tmp/saved-temporarily .env.local && \
    yarn build


###################################
# Second, use a compact runner for quicker deployments / scale-ups / etc
FROM $RUNTIME_IMAGE as runner

# Prepare / Setup / Defaults
## ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

# Re-run and install only production/runtime dependencies
COPY --from=builder /app/package.json ./
RUN apt-get -y update && \
    apt-get -y --no-install-recommends install git ca-certificates && \
    yarn install --production --ignore-scripts --prefer-offline && \
    apt-get -y remove git && \
    apt-get -y autoremove && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/tmp/* && \
    rm -rf /usr/local/share/.cache

# Copy over needed files
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env.local ./
COPY --from=builder /app/next-i18next.config.js ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/i18n ./i18n

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
CMD ["yarn", "start"]
