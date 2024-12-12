#!/bin/bash


DATABASE_URL=file://prd.db && node apps/rsvp/main.js&

caddy run /etc/caddy/Caddyfile