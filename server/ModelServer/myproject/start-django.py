import os
import sys

from django.core.management import execute_from_command_line

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")  # Replace 'myproject' with your project name
execute_from_command_line(["manage.py", "runserver", "0.0.0.0:8000"])
