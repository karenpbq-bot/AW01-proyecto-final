# users/urls.py
# Este archivo define las URLs solo para la app 'users'.

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Creamos un router para registrar automáticamente las rutas del ViewSet.
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# Las urlpatterns de esta app incluyen las rutas generadas por el router.
urlpatterns = [
    path('', include(router.urls)),
]
