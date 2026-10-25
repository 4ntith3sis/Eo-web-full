#!/bin/sh
set -eu

export NODE_OPTIONS="${NODE_OPTIONS:-} --experimental-webstorage"
export PAYLOAD_CONFIG_PATH="/app/payload.config.mjs"
exec node node_modules/payload/bin.js "$@"
