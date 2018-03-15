#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

# clean up any previous build
echo "Cleanup any old images"
docker images -q $APP_NAME|xargs docker rmi || true

# build and tag
echo "Building new image"
docker build -t "$APP_NAME:$VERSION" $APP_PATH