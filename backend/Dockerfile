FROM node:18-alpine

WORKDIR /app

ENV SERVER_PORT=8080
ENV DB_NAME=ready-vet-go-dev

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

RUN npm run build

EXPOSE 8080

CMD [ "npm", "run", "start"]

