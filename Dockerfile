FROM node:6.3

MAINTAINER DevWurm <devwurm@devwurm.net>

ARG HTTP_PORT=8080
ARG HTTPS_PORT=8443

WORKDIR api-server

COPY lib/ ./lib
COPY bin/ ./bin
COPY package.json .

RUN npm install --only=production

EXPOSE $HTTP_PORT
EXPOSE $HTTPS_PORT

CMD node ./bin/www