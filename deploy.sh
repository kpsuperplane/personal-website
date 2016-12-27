#! /bin/bash

git remote add dokku dokku@$server_ip:beta  
git push dokku 4.0:master