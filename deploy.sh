#! /bin/bash
echo "LogLevel=quiet" > ~/.ssh/config
git remote add dokku dokku@$server_ip:personal
yes | git push dokku production:master
