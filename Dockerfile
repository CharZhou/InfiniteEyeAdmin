#Main Image
FROM nginx
MAINTAINER charzhou

EXPOSE 80/tcp

COPY ./dist /usr/share/nginx/html

HEALTHCHECK --interval=5s --timeout=3s --retries=12 CMD curl --silent --fail localhost:80/ || exit 1
