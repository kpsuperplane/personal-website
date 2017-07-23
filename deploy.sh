#! /bin/bash
echo "LogLevel=quiet" > ~/.ssh/config
git remote add dokku dokku@$server_ip:beta
echo -e "Host ${server_ip}\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
git push -f dokku 2017:master