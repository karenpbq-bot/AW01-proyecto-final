# mi-proyecto-backend/users/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer to handle User data, including secure password creation and updates.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_superuser']
        
        # --- ¡LA CORRECCIÓN CLAVE ESTÁ AQUÍ! ---
        extra_kwargs = {
            # 1. 'write_only': No se devuelve en la respuesta.
            # 2. 'required': False: Permite que las peticiones PUT/PATCH funcionen sin enviar la contraseña.
            'password': {'write_only': True, 'required': False} 
        }

    def create(self, validated_data):
        """
        Maneja la creación de usuario con hashing.
        """
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """
        Maneja las actualizaciones de usuario, actualizando la contraseña solo si se envía.
        """
        # La línea .pop('password', None) maneja la contraseña de forma segura.
        # Si 'password' no existe en validated_data, usa None y no causa error.
        password = validated_data.pop('password', None)
        
        # Llama al método update por defecto para los demás campos (username, first_name, etc.)
        # Nota: La llamada a super().update es más limpia, pero dado que ya tienes lógica
        # para actualizar cada campo manualmente, mantendremos ese estilo por coherencia.
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)

        if password:
            instance.set_password(password) # Hashea la nueva contraseña solo si se envió
        
        instance.save()
        return instance