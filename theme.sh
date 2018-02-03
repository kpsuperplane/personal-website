#!/bin/bash
cd content/themes/personal && npm install -g webpack && npm install --production=false && NODE_ENV="production" webpack