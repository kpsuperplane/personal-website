#! /bin/bash
echo "LogLevel=quiet" > ~/.ssh/config
git remote add dokku dokku@$server_ip:2017
echo -e "Host ${server_ip}\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
git push -f dokku master:master