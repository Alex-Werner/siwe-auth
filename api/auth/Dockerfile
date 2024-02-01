
#FROM node:21.6.1-alpine3.19 as builder
FROM node:21.6.1-alpine3.19

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev

RUN npm rebuild sqlite3
#FROM node:21.6.1-alpine3.19

#ENV NODE_ENV production
#
#USER node
#WORKDIR /home/node

#COPY --from=builder --chown=node:node /home/node/package*.json ./
#COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
#COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

#COPY --chown=node:node package*.json ./
#COPY --chown=node:node --from=0 /home/node/node_modules/ ./node_modules/
#COPY --chown=node:node --from=0 /home/node/dist/ ./dist/

CMD ["npm", "run", "start:prod", "--silent"]
