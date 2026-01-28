#!/bin/bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.cert
echo "Self-signed certs generated! Edit start.sh to use HTTPS if desired."
