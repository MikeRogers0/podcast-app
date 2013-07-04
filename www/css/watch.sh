#!/usr/bin/env bash

# This is the code you need to compile / watch the SCSS files.
sass -w styles.scss

# to compile on the server just run in your post hook :D
# sass --style compressed --update www/css/styles.scss -f