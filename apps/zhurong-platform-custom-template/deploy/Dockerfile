FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/default.conf

# 注意路径
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/proxy.conf /etc/nginx/proxy.conf

COPY dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
