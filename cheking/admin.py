# admin.py

from django.contrib import admin
from .models import *
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from import_export import resources
from import_export.admin import ImportExportMixin

# Define the Import/Export Resource for the Invite model
class InviteResource(resources.ModelResource):
    class Meta:
        model = Invite
        # Specify the fields you want to import and export
        fields = ('id', 'nom', 'invitation', 'nombre', 'est_present', 'attente_de_validation', 'lien_amitie', 'ville', 'quartier',)
        # Exclude fields if necessary (alternative to 'fields')
        # exclude = ('id',) 
        # You can specify which fields will be imported or exported, if different
        # import_id_fields = ('id',)
        # export_order = ('id', 'nom', ...)

# The complete InviteAdmin class with ImportExportMixin
class InviteAdmin(ImportExportMixin, admin.ModelAdmin):
    resource_class = InviteResource
    list_display = ("nom", "invitation", "nombre", "get_table", "ville", "quartier", "est_present", "attente_de_validation")
    search_fields = ("nom", "invitation__code", "ville__nom", "quartier__nom")
    list_filter = ("est_present", "attente_de_validation", "ville", "quartier")

    def get_table(self, obj):
        return obj.invitation.table if obj.invitation and obj.invitation.table else "-"
    get_table.short_description = "Table assignée"

# Your other admin classes...
class QrAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display=("code", "table")
    search_fields = ("code",)
    list_filter = ("code",)

class CustomAdminSite(admin.AdminSite):
    site_url = '/cheking/dashboard/'
    
# Register your models
custom_admin_site = CustomAdminSite(name='custom_admin')
custom_admin_site.register(Ville)
custom_admin_site.register(Quartier)
custom_admin_site.register(Invite, InviteAdmin)
custom_admin_site.register(QrCode, QrAdmin)
custom_admin_site.register(Tables)
custom_admin_site.register(LienAmitie)
custom_admin_site.register(User, UserAdmin)
custom_admin_site.register(Group, GroupAdmin)