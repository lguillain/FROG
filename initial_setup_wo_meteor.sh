#!/bin/bash

shopt -s dotglob

FROG=`pwd`
YARN=yarn
which yarn | grep -qw yarn || npm install yarn@0.24.6
which yarn | grep -qw yarn || YARN=$FROG/node_modules/.bin/yarn
$YARN install

# install package frog-utils
cd $FROG/frog-utils
ln -s $FROG/.babelrc . 2>/dev/null
$YARN install & 

# install activities and operators packages
for dir in $FROG/ac/ac-*/ $FROG/op/op-*/
do
    cd $dir
    ln -s $FROG/.babelrc . 2>/dev/null
    $YARN install &
done

# links all packages to the frog/ meteor project
cd $FROG/frog
ln -s $FROG/.babelrc . 2>/dev/null
ln -s $FROG/node_modules . 2>/dev/null

exit 0
