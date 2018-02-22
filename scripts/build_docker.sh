#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

# clean up any previous build
echo "Cleanup any old images"
docker rmi -f $APP_NAME

# build and tag
echo "Building new image"
docker build -t "$APP_NAME:$VERSION" $APP_PATH