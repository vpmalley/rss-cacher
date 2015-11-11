#!/usr/bin/env bash

cd ~/workspace/rss-cacher;
cp -r output/fi ~/workspace/myblog/
cp -r output/fm ~/workspace/myblog/

cd ~/workspace/myblog/
git add fi/
git add fm/
git commit -m"updated radio shows" 
