#!/bin/bash
cd content/themes/personal && yarn global add webpack && yarn install --production=false && NODE_ENV="production" webpack