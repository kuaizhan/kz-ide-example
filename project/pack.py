#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import sys

file_names = sys.argv[1:]

for file_name in file_names:
    cmd = 'cd ' + file_name + ' && zip -r ' + file_name + '.zip * && mv ' + file_name + '.zip ../'
    os.system(cmd)
