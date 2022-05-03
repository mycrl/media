#!/bin/bash

npm i
npm run build --workspace=page

cp ./media.service /etc/systemd/system/media.service
systemctl enable media.service
systemctl start media.service
