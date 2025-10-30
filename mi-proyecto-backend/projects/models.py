from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    owner = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Activity(models.Model):
    # --- ¡NUEVO CAMPO DE ESTADO! ---
    class Status(models.TextChoices):
        PENDIENTE = 'PENDIENTE', 'Pendiente'
        EN_PROGRESO = 'EN_PROGRESO', 'En Progreso'
        COMPLETADA = 'COMPLETADA', 'Completada'

    project = models.ForeignKey(Project, related_name='activities', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    entregables = models.TextField(blank=True, null=True) 
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Añadimos el campo 'status' a la base de datos.
    # Por defecto, todas las actividades nuevas serán 'PENDIENTE'.
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDIENTE
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name