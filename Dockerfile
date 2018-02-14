FROM alpine:latest

RUN   apk update && apk add nodejs python make gcc g++ musl-dev && mkdir -p /opt/amazon-mws-grabber

COPY  . /opt/amazon-mws-grabber
WORKDIR /opt/amazon-mws-grabber

# Install npm modules and remove build dependencies
RUN   npm install --unsafe-perms && apk del python make gcc g++ musl-dev

ENTRYPOINT node src/index.js
