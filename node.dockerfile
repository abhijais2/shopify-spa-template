FROM node:latest

MAINTAINER Abhishek Jaiswal

COPY . /var/www
WORKDIR /var/www

VOLUME ["/var/www"]

RUN npm install

ENTRYPOINT ["npm", "start"]
