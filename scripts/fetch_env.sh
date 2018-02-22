#!/bin/bash

DIR="${BASH_SOURCE%/*}"
if [[ ! -d "$DIR" ]]; then DIR="$PWD"; fi
source "$DIR/common.sh"

aws s3 cp s3://deployment.secrets/$DEPLOYMENT_GROUP_NAME/$APP_NAME/latest $ENV_FILE