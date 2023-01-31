FROM nginx
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /home
RUN mkdir -p /home/certificates
COPY cert.pem /home/certificates/cert.pem
COPY privkey.pem /home/certificates/privkey.pem