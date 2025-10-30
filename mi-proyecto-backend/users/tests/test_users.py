import pytest
from django.contrib.auth.models import User
from users.serializers import UserSerializer
from rest_framework.exceptions import ValidationError

@pytest.mark.django_db
def test_creacion_segura_usuario():
    """
    Caso Normal: Verifica que la contraseña no se guarde en texto plano (seguridad).
    """
    print("\n--- Ejecutando test_creacion_segura_usuario ---")
    data = {'username': 'testseguro', 'password': 'passwordfuerte123'}
    
    serializer = UserSerializer(data=data)
    # Si la validación falla (ej. faltan campos), lanza la excepción.
    serializer.is_valid(raise_exception=True) 
    
    user_instance = serializer.save()
    
    # Assert 1: La contraseña hasheada NO debe coincidir con el texto plano.
    assert user_instance.password != 'passwordfuerte123'
    
    # Assert 2: Django debe ser capaz de verificar el hash con el texto plano.
    assert user_instance.check_password('passwordfuerte123') is True
    
@pytest.mark.django_db
def test_username_duplicado():
    """
    Caso Error: Verifica que el serializador lance un error si el username ya existe.
    """
    print("\n--- Ejecutando test_username_duplicado ---")
    
    # 1. Precondición: Crear un usuario que ya existe en la DB.
    User.objects.create_user(username='existente', password='p1')
    
    # 2. Intentar crear un segundo usuario con el mismo nombre.
    data = {'username': 'existente', 'password': 'p2'}
    serializer = UserSerializer(data=data)
    
    # Assert: Se espera que Pytest capture una excepción de validación (ValidationError)
    # antes de que la prueba termine. Si no lanza la excepción, la prueba falla.
    with pytest.raises(ValidationError):
        serializer.is_valid(raise_exception=True)