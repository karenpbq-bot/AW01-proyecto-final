# mi-proyecto-backend/users/views.py

from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from .serializers import UserSerializer

# --- THE FIX IS HERE ---
# We use 'ModelViewSet' which enables all CRUD operations, including "POST".
# We also use 'IsAdminUser' to ensure only superusers can manage other users.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed, created, edited, and deleted.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]