#! /bin/bash
echo "LogLevel=quiet" > ~/.ssh/config
git remote add dokku dokku@$server_ip:personal
echo -e "Host ${server_ip}\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
git push dokku production:master
