#!/bin/bash

cp -r ./* /etc/ikan-reptile/
cd /etc/ikan-reptile

npm i
cd view
npm i
npm run build
cd ../

cp ./ikan.service /etc/systemd/system/ikan.service
systemctl enable ikan.service
systemctl start ikan.service
