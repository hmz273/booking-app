FROM node:16.13.2-alpine3.14

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 4001

CMD [ "yarn", "dev" ]
