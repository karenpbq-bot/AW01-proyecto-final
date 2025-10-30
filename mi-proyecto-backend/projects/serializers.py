# mi-proyecto-backend/projects/serializers.py

from rest_framework import serializers
from .models import Project, Activity
from django.contrib.auth.models import User

# --- 1. Serializer para el modelo de Usuario (se mantiene) ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

# --- 2. Serializer Anidado de Actividad (NUEVO) ---
# Usamos este para especificar qué campos de la actividad queremos ver dentro del proyecto.
class ActivityNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        # Incluimos los campos relevantes para la visualización en la lista
        fields = ['id', 'name', 'start_date', 'end_date', 'status']

# --- 3. ProjectSerializer (CORREGIDO) ---
class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    # --- ¡CORRECCIÓN CLAVE! Anidar la lista completa de actividades ---
    # 'activities' debe coincidir con el related_name del ForeignKey en Activity.
    # many=True es esencial para devolver una lista, no solo un objeto.
    activities = ActivityNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        # Listamos explícitamente los campos para asegurarnos de incluir 'activities'
        fields = ['id', 'owner', 'title', 'description', 'start_date', 'end_date', 'activities', 'created_at', 'updated_at'] 
        read_only_fields = ('owner',)

# --- 4. Serializer Principal de Actividad (se mantiene) ---
class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('project',)