#!/bin/bash

if [ -n "${DEPLOYMENT_ID}" ]; then
    VERSION=$DEPLOYMENT_ID
else
    VERSION=master
fi

echo "VERSION: $VERSION"

if [ -n "${APPLICATION_NAME}" ]; then
    APP_NAME=$APPLICATION_NAME
else
    APP_NAME="market-history-service"
fi

echo "APP_NAME: $NAME"

if [ -n "${APPLICATION_NAME}" ]; then
    APP_PATH=/opt/${APP_NAME}
else
    APP_PATH=$(pwd)
fi

echo "APP_PATH: ${APP_PATH}"