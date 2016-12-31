#! /bin/bash
echo "LogLevel=quiet" > ~/.ssh/config
git remote add dokku dokku@$server_ip:personal  
git fetch --unshallow
git push dokku production:master