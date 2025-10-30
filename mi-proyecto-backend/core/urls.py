# mi-proyecto-backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Admin site URL
    path('admin/', admin.site.urls),

    # --- Authentication URLs ---
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # --- App-specific URLs ---
    # This single line includes all URLs from your 'users' app (like /api/users/)
    path('api/', include('users.urls')),
    
    # This includes all URLs from your 'projects' app
    path('api/projects/', include('projects.urls')),
]
