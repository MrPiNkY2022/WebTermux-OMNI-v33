#!/bin/bash
pkg install ngrok -y
echo "Enter your ngrok authtoken:"
read token
ngrok authtoken $token
ngrok http 3000
