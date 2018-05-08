#!/bin/bash
cd content/themes/personal && npm install --production=false && NODE_ENV="production" node_modules/.bin/webpack