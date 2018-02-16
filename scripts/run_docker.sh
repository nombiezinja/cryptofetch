#!/bin/bash

source ./scripts/common.sh

docker run -d --rm --name market-history-service \
    --env PORT=8080 -p 8080:8080 \
    market-history-service:$VERSION