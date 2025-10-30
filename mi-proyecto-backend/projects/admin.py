# mi-proyecto-backend/projects/admin.py

from django.contrib import admin
from .models import Project, Activity

# This class customizes how Projects are displayed in the admin panel
class ProjectAdmin(admin.ModelAdmin):
    """
    Customizes the display for the Project model in the Django admin.
    
    It shows the project's title, owner, and creation date in the list view
    and adds helpful filters and a search bar.
    """
    # Use 'title' to match the field in your models.py
    list_display = ('title', 'owner', 'created_at')
    
    # Adds a convenient filter sidebar to sort by owner
    list_filter = ('owner',)
    
    # Adds a search bar to search by title
    search_fields = ('title',)

# This class customizes how Activities are displayed
class ActivityAdmin(admin.ModelAdmin):
    """
    Customizes the display for the Activity model.
    
    Shows key details in the list and allows filtering by project and status.
    """
    list_display = ('name', 'project', 'status', 'end_date')
    list_filter = ('project', 'status')
    search_fields = ('name', 'description')

# Register your models with the admin site.
# The Project model will use the custom ProjectAdmin settings.
# The Activity model will use the custom ActivityAdmin settings.
admin.site.register(Project, ProjectAdmin)
admin.site.register(Activity, ActivityAdmin)