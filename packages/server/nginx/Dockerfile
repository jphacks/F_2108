FROM nginx:1.20

RUN unlink /var/log/nginx/access.log && touch /var/log/nginx/access.log &&\
    unlink /var/log/nginx/error.log && touch /var/log/nginx/error.log

COPY template/default.conf.template /etc/nginx/templates/default.conf.template
ENV APP_HOST localhost
ENV APP_PORT 3000

EXPOSE 80

CMD ["nginx", "-g daemon off;"]
