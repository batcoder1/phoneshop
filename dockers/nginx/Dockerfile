FROM nginx

RUN rm /etc/nginx/conf.d/default.conf


RUN mkdir -p /opt/app

COPY . /opt/app
 
COPY ./conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/nginx.conf