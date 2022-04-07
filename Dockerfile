FROM node:17

WORKDIR /app

COPY package*.json ./

COPY yarn* ./

RUN yarn

COPY . .

RUN yarn prisma generate

RUN yarn prisma migrate deploy

RUN yarn build

ENV PORT=8080

ENV LOAD_DUMMY_DATA=1

EXPOSE 8080

CMD [ "yarn", "start:prod" ]