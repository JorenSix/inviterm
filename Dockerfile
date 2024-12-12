
FROM node:22.12-bookworm-slim


# Install Caddy
RUN apt update && apt install -y debian-keyring debian-archive-keyring apt-transport-https curl 
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
RUN curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
RUN  apt update && apt install -y caddy

# copy dist folder
COPY ./dist /var/www
COPY ./prisma /var/www/prisma
COPY package.json /var/www/

WORKDIR /var/www/

# Install dependencies and generate prisma client
RUN NODE_ENV=production npm install --force  && npx prisma generate

COPY startup_script.sh / 
RUN chmod +x /startup_script.sh

COPY Caddyfile /etc/caddy/Caddyfile



ENTRYPOINT ["/startup_script.sh"]
