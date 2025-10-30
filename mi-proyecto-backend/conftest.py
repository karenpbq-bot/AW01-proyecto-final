# mi-proyecto-backend/conftest.py

import os
import django

# Forzar la inicialización de las apps de Django antes de que Pytest las recoja
# Esto resuelve el error AppRegistryNotReady
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Nota: Este archivo necesita estar en la misma carpeta que manage.py