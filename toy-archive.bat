#!/bin/bash
set -euo pipefail
cd toy
npm install
npm run main:build
npm run main:run
