#!/bin/bash
for FILE in $(find -name "*.js" -not -path "./node_modules/*" -not -path "./babel.config.js" -not -path "./.eslintrc.js")
do
    echo "Checking file $FILE"
    npx eslint $FILE
done
