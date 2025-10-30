from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Project, Activity
from .serializers import ProjectSerializer, ActivitySerializer

# --- Vista para Proyectos
class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user)
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

# --- Vista para Actividades
class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        project_pk = self.kwargs['project_pk']
        return Activity.objects.filter(project_id=project_pk, project__owner=self.request.user)
    def perform_create(self, serializer):
        project_pk = self.kwargs['project_pk']
        project = Project.objects.get(pk=project_pk)
        serializer.save(project=project)

# --- Vista para DASHBOARD
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_projects = Project.objects.filter(owner=request.user)
        user_activities = Activity.objects.filter(project__in=user_projects)

        total_projects = user_projects.count()
        total_activities = user_activities.count()
        completed_activities = user_activities.filter(status='COMPLETADA').count()
        pending_activities = user_activities.filter(status='PENDIENTE').count()
        
        # Datos que vamos a devolver
        stats_data = {
            'total_projects': total_projects,
            'total_activities': total_activities,
            'completed_activities': completed_activities,
            'pending_activities': pending_activities,
        }
        
        return Response(stats_data)