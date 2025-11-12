# mi-proyecto-backend/locustfile.py

from locust import HttpUser, task, between
import os

# --- TOKEN JWT OBTENIDO DE POSTMAN (La llave de acceso) ---
# Este Token es válido y se utiliza para la autenticación de la prueba de carga.
TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyOTE5MDA5LCJpYXQiOjE3NjI5MTg3MDksImp0aSI6Ijg2MmUyZmZlZmU4ZTQ3OTQ4YWU3N2JhNzEwMmZmMGNiIiwidXNlcl9pZCI6IjEifQ.oKBri8EVsru2PGDUKyDy-ZDfPnrUt-KaSYSVpvckbZk" 

class ProjectUser(HttpUser):
    # La URL base de tu API Django
    host = "http://127.0.0.1:8000"
    # Tiempo de espera entre cada tarea (simulando pausas humanas: 1 a 3 segundos)
    wait_time = between(1, 3) 

    def on_start(self):
        """Se ejecuta al inicio de la sesión de cada usuario simulado."""
        if not TEST_TOKEN:
            print("ERROR: El token TEST_TOKEN está vacío. La prueba fallará por 401.")
            return
            
        # Configurar el header de autorización con el Token Bearer
        self.client.headers = {"Authorization": f"Bearer {TEST_TOKEN}"}

    @task(3) # Pesa 3: Tarea más frecuente (Simula la carga pesada)
    def list_projects(self):
        """IT-LC-001: Simula listar los proyectos (GET /api/projects/)"""
        self.client.get("/api/projects/", name="1. Listar Proyectos")

    @task(1) # Pesa 1: Tarea menos frecuente
    def get_specific_project(self):
        """IT-LC-002: Simula acceder a los detalles de un proyecto (usamos ID 1)"""
        # Asegúrate de que un proyecto con ID 1 exista en tu base de datos
        self.client.get("/api/projects/1/", name="2. Obtener Detalle Proyecto")