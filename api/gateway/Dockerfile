FROM node:21-alpine

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build \
    && npm prune --omit=dev


CMD ["npm", "run", "start:prod", "--silent"]
