#!/bin/bash

if [ -n "${DEPLOYMENT_ID}" ]; then
    VERSION=$DEPLOYMENT_ID
else
    VERSION=$(git rev-parse --short HEAD)
fi

echo "VERSION: $VERSION"

if [ -n "${APPLICATION_NAME}" ]; then
    APP_NAME=$APPLICATION_NAME
else
    APP_NAME="${PWD##*/}"
fi

echo "APP_NAME: $APP_NAME"

if [ -n "${APPLICATION_NAME}" ]; then
    APP_PATH=/opt/${APP_NAME}
else
    APP_PATH=$(pwd)
fi

echo "APP_PATH: ${APP_PATH}"