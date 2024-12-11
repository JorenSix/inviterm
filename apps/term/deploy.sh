#!/bin/bash

scp *.html favicon.ico joren@0110.be:'/var/www/be.0110.0x28/'
scp -r js/* joren@0110.be:'/var/www/be.0110.0x28/js'
scp -r css/* joren@0110.be:'/var/www/be.0110.0x28/css/'
#scp -r sounds/* joren@0110.be:'/var/www/be.0110.0x28/'
#scp -r node_modules joren@0110.be:'/var/www/be.0110.0x28/'

