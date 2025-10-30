# accounts/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserProfileView # <-- Importa la nueva vista

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    # --- NUEVA RUTA PARA EL PERFIL ('/api/me/') ---
    path('me/', UserProfileView.as_view(), name='user-profile'),
]