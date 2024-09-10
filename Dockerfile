FROM node:lts as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock .env ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM node:lts-slim

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

COPY package.json yarn.lock .env ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/main.js" ]