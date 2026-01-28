#!/bin/bash
echo "WEBTERMUX OMNI V33 Genius Setup Starting..."
pkg update -y && pkg upgrade -y
pkg install nodejs-lts openssl-tool -y
npm install -g npm
git clone https://github.com/yourusername/WEBTERMUX-OMNI-V33.git
cd WEBTERMUX-OMNI-V33
npm install
echo "Setup complete! Edit config.json password, then run bash start.sh"
