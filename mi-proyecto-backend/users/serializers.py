from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer to handle User data, including secure password creation and updates.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'is_superuser']
        
        extra_kwargs = {
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
        password = validated_data.pop('password', None)
        
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)

        if password:
            instance.set_password(password)
        
        instance.save()
        return instance