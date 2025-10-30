from rest_framework import serializers
from .models import Project, Activity
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class ActivityNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'name', 'start_date', 'end_date', 'status']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    
    activities = ActivityNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'owner', 'title', 'description', 'start_date', 'end_date', 'activities', 'created_at', 'updated_at'] 
        read_only_fields = ('owner',)

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('project',)