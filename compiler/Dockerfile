FROM --platform=linux/amd64 node:24-alpine

WORKDIR /app

RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip \
    bash


RUN g++ --version && \
    javac -version && \
    java -version && \
    python3 --version


COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8752

CMD [ "node", "index.js" ]