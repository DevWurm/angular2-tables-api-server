FROM node:6.3

MAINTAINER DevWurm <devwurm@devwurm.net>

ARG HTTP_PORT=80
ARG HTTPS_PORT=443

WORKDIR /api-server

COPY lib/ ./lib
COPY bin/ ./bin
COPY package.json .

RUN npm install -g

EXPOSE $HTTP_PORT
EXPOSE $HTTPS_PORT

CMD wv-api-server