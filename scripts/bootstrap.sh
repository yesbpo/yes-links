#!/usr/bin/env sh
set -eu

python -m pip install --upgrade pip
pip install -e '.[dev]'
pre-commit install
