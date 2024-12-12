#!/bin/bash


DATABASE_URL=file://prd.db  npx prisma migrate deploy
DATABASE_URL=file://prd.db  node apps/rsvp/main.js&

caddy run --config /etc/caddy/Caddyfile