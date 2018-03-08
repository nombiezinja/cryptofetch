#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

export $(cat $ENV_FILE | grep -v ^# | xargs)

docker run -d --rm \
    --name $APP_NAME \
    --env-file $ENV_FILE \
    --restart unless-stopped \
    -p $PORT:$PORT \
    $APP_NAME:$VERSION

unset $(cat $ENV_FILE | grep -v ^# | sed -E 's/(.*)=.*/\1/' | xargs) 