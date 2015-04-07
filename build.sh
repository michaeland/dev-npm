#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo "entering $DIR"
cd $DIR

echo "getting dependencies …"
npm install

echo "building …"
npm run build

echo "finished build"