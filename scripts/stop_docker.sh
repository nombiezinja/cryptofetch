#!/bin/bash

source ./scripts/common.sh

# TODO check for running image before stop
docker stop $APP_NAME || true