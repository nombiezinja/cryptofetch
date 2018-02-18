#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

docker run -d --rm --name $APP_NAME \
    --env PORT=8080 -p 8080:8080 \
    $APP_NAME:$VERSION