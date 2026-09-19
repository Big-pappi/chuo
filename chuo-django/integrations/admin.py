from django.contrib import admin
from integrations.models import UniversityIntegration, SyncLog


@admin.register(UniversityIntegration)
class UniversityIntegrationAdmin(admin.ModelAdmin):
    list_display = ['university', 'api_type', 'sync_enabled', 'last_sync', 'sync_frequency']
    list_filter = ['api_type', 'sync_enabled']
    search_fields = ['university__name', 'api_endpoint']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    list_display = ['integration', 'sync_type', 'status', 'records_processed', 'records_failed', 'started_at', 'completed_at']
    list_filter = ['sync_type', 'status']
    search_fields = ['integration__university__name']
    readonly_fields = ['started_at', 'completed_at', 'created_at']
