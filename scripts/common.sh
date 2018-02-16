#!/bin/bash

if [ -n "${DEPLOYMENT_ID}" ]; then
    VERSION=$DEPLOYMENT_ID
else
    VERSION=master
fi

echo "VERSION: $VERSION"