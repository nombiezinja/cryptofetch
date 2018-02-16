#!/bin/bash

source ./scripts/common.sh

# clean up any previous build
echo "Cleanup any old images"
docker rmi -f market-history-server:$VERSION

# build and tag
echo "Building new image"
docker build -t market-history-service:$VERSION .