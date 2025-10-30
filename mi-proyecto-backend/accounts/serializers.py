# accounts/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

# Serializer para listar y ver detalles de usuarios
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Definimos los campos que queremos mostrar
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# Serializer para crear nuevos usuarios
class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Para crear un usuario, necesitamos estos campos
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        # Nos aseguramos de que la contraseña no sea retornada en la respuesta
        extra_kwargs = {'password': {'write_only': True}}

    # Esta función se ejecuta cuando se crea un usuario.
    # Se encarga de hashear la contraseña de forma segura.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    # accounts/serializers.py

# ... (las clases UserSerializer y RegisterUserSerializer que ya existen) ...

# --- NUEVA CLASE PARA ACTUALIZAR EL PERFIL ---
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Campos que el usuario SÍ puede cambiar
        fields = ['username', 'email', 'first_name', 'last_name']