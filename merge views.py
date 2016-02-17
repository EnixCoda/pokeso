# coding: utf-8
import re
import os

'''
for each JS files in app/scripts/ ,
"'templateUrl': '/path/to/xxx.html'" will be replaced by "'template': contentOfXxx.html"
then be copied to dist/
'''

def merge(source_file, target_file):
    with open(source_file, 'r') as app_js_file:
        app_js = app_js_file.read()
    views = re.findall(r"templateUrl: *?'(.*?)'", app_js)
    for view in views:
        with open(view.replace('views', 'preproc/minHTML'), 'r') as view_file:
            view_content = view_file.read()
        app_js = app_js.replace('templateUrl:', 'template:')
        app_js = app_js.replace(view, view_content.replace("'", "\\'"))
    with open(target_file, 'w') as new_app_js:
        new_app_js.write(app_js)
    pass


def scan_dir(cur):
    if cur[-1] != '/':
        cur += '/'
    dirs = os.listdir(cur)
    for dir in dirs:
        if os.path.isfile(cur + dir):
            merge(cur + dir, 'preproc/' + (cur + dir)[second_c_in_str('/', (cur + dir)) + 1:])
            print cur + dir, 'preproc/' + (cur + dir)[second_c_in_str('/', (cur + dir)) + 1:]
        else:
            scan_dir(cur + dir)


def second_c_in_str(c, str):
    if str.find(c) > -1:
        str_after_first = str[str.find(c) + 1:]
        if str_after_first.find(c) > -1:
            return str.find(c) + 1 + str_after_first.find(c)
        else:
            return -1
    else:
        return -1


os.makedirs('preproc/controllers')
start_dir = 'app/scripts/'
scan_dir(start_dir)
