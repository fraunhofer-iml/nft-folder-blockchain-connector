# Copyright Open Logistics Foundation
#
# Licensed under the Open Logistics Foundation License 1.3.
# For details on the licensing terms, see the LICENSE file.
# SPDX-License-Identifier: OLFL-1.3

FROM node:18.16.0-alpine3.18

RUN apk add --no-cache git

# Workaround for npm permission problem
# see https://github.com/npm/cli/issues/5114#issuecomment-1196456412
RUN mkdir /.npm
RUN chown -R 1000860000:0 "/.npm"
RUN npm cache clean --force
RUN npm install -g npm@8.11.0

WORKDIR /app
COPY dist /app/dist
COPY package.json .
RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]
