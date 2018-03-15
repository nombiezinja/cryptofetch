#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

# TODO check for running image before stop
docker stop $APP_NAME || true
docker rm $APP_NAME || true