#!/usr/bin/env bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo "entering $DIR"
cd $DIR

echo "getting dependencies …"
yarn install

echo "building …"
yarn build

echo "finished build"