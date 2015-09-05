#!/usr/bin/env bash

curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y nodejs git
npm install npm -g

mkdir /home/vagrant/mongodb
cd /home/vagrant/mongodb

mkdir /data
chown vagrant:vagrant /data
mkdir /data/db
chown vagrant:vagrant /data/db

cd /home/vagrant
git clone https://github.com/vpmalley/vpmalley.github.io.git

cd /home/vagrant/mongodb
curl -O http://downloads.mongodb.org/linux/mongodb-linux-x86_64-3.0.3.tgz
tar -zxvf mongodb-linux-x86_64-3.0.3.tgz

cd /home/vagrant/rss-cacher
chmod +x ./start_node.sh
chmod +x ./start_mongod.sh
chmod +x ./stop_mongod.sh

date > /etc/vagrant_provisioned_at
