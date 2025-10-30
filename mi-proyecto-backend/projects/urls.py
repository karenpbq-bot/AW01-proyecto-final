from django.urls import path, include
from rest_framework_nested import routers
# 1. Importamos la nueva vista del dashboard
from .views import ProjectViewSet, ActivityViewSet, DashboardStatsView 

# Router para los proyectos (ej: /api/projects/)
router = routers.SimpleRouter()
router.register(r'', ProjectViewSet, basename='project')

# Router anidado para las actividades (ej: /api/projects/1/activities/)
projects_router = routers.NestedSimpleRouter(router, r'', lookup='project')
projects_router.register(r'activities', ActivityViewSet, basename='project-activities')

# --- Lista Final de URLs ---
urlpatterns = [
    # Ruta específica para las estadísticas: /api/projects/dashboard/
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    
    # Rutas para proyectos y actividades (generadas por los routers)
    path('', include(router.urls)),
    path('', include(projects_router.urls)),
]