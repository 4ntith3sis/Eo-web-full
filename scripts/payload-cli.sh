#!/bin/sh
set -eu

export PAYLOAD_CONFIG_PATH="/app/payload.config.mjs"
export NODE_OPTIONS="${NODE_OPTIONS:-} --require=/app/scripts/undici-preload.cjs"
exec node node_modules/payload/bin.js "$@"
