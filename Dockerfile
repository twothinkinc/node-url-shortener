FROM node:11
MAINTAINER John Adams <john@twothink.co>
ENV ALEMBIC_ROOT /alembic/nus
WORKDIR $ALEMBIC_ROOT
COPY . /alembic/nus
CMD node app.js -p 8008 -u http://localhost:8008 --redis-host redis --redis-port 6379

WORKDIR /alembic/nus
RUN mkdir node_modules
RUN npm install

EXPOSE 8008

