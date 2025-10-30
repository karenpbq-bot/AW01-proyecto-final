# accounts/views.py

from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from .serializers import UserSerializer, RegisterUserSerializer

class IsActiveAdminUser(permissions.BasePermission):
    """
    Permiso personalizado para permitir el acceso solo a administradores activos.
    """
    def has_permission(self, request, view):
        # --- NUESTROS ESPÍAS ---
        print("--- VERIFICANDO PERMISOS ---")

        # Comprobamos si el objeto 'user' existe
        if request.user:
            print(f"Usuario detectado: {request.user.username}")
            print(f"¿Es staff?: {request.user.is_staff}")
            print(f"¿Está activo?: {request.user.is_active}")
        else:
            print("No se detectó ningún usuario en la petición.")

        # La regla de permiso real
        is_allowed = request.user and request.user.is_staff and request.user.is_active

        print(f"¿Se permite el acceso?: {is_allowed}")
        print("--------------------------")

        return is_allowed

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsActiveAdminUser] # Usamos nuestra regla con espías

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterUserSerializer
        return UserSerializer
# accounts/views.py
from rest_framework import generics, permissions
# Asegúrate de importar el nuevo serializer
from .serializers import UserSerializer, RegisterUserSerializer, UpdateUserSerializer

# ... (la clase UserViewSet que ya existe) ...

# --- NUEVA VISTA PARA EL PERFIL DEL USUARIO ('/me/') ---
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo para usuarios logueados

    # Esta es la magia: no busca un ID en la URL,
    # simplemente devuelve el usuario que está haciendo la petición.
    def get_object(self):
        return self.request.user

    # Usamos UserSerializer para MOSTRAR los datos (GET)
    # y UpdateUserSerializer para ACTUALIZARLOS (PUT/PATCH)
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UpdateUserSerializer