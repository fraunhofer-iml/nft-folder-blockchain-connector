# Copyright Open Logistics Foundation
#
# Licensed under the Open Logistics Foundation License 1.3.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: OLFL-1.3

################
# Dependencies #
################
FROM node:20-alpine3.19 as dependencies

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production --ignore-scripts

##########
# Runner #
##########
FROM node:20-alpine3.19 as runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/package.json ./package.json
COPY dist/ .

RUN chown -R node:node .
USER node

EXPOSE 3000

CMD ["dumb-init", "node", "main.js"]
