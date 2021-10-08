#!/bin/bash

npm i
cd page
npm run build
cd ../

cp ./media.service /etc/systemd/system/media.service
systemctl enable media.service
systemctl start media.service
