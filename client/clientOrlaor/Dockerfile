############################### CONTAINER ################################
FROM nginx:1.15
ARG APP_NAME=orlaor-app
WORKDIR /usr/local/$APP_NAME

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/clientOrlaor /usr/share/nginx/html
COPY .htpasswd  /etc/apache2/.htpasswd
