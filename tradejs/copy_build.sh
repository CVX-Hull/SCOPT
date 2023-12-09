#!/bin/bash

rm -rf ../static/*
find ./build -maxdepth 1 -type f | xargs cp -t ../static
cp -r build/static/* ../static