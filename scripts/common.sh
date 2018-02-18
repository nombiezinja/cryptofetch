#!/bin/bash

if [ -n "${DEPLOYMENT_ID}" ]; then
    VERSION=$DEPLOYMENT_ID
else
    VERSION=master
fi

echo "VERSION: $VERSION"

if [ -n "${DEPLOYMENT_STAGE}" ]; then
    APP_NAME=$DEPLOYMENT_STAGE
else
    APP_NAME="market-history-service"
fi

echo "APP_NAME: $NAME"