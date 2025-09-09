from django.contrib import admin
from .models import *
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin, GroupAdmin

class QrAdmin(admin.ModelAdmin):
    list_display=("code", "table")
    search_fields = ("code",)
    list_filter = ("code",)

class InviteAdmin(admin.ModelAdmin):
    list_display = ("nom", "invitation", "nombre", "ville", "quartier","est_present", "attente_de_validation")
    search_fields = ("nom", "invitation__code", "ville__nom", "quartier__nom")
    list_filter = ("est_present", "attente_de_validation", "ville", "quartier")

class CustomAdminSite(admin.AdminSite):
    site_url = '/cheking/'  # Définit le lien du bouton "View site"

# Register your models here.
custom_admin_site = CustomAdminSite(name='custom_admin')
custom_admin_site.register(Ville)
custom_admin_site.register(Quartier)
custom_admin_site.register(Invite, InviteAdmin)
custom_admin_site.register(QrCode, QrAdmin)
custom_admin_site.register(Tables)
custom_admin_site.register(LienAmitie)
custom_admin_site.register(User, UserAdmin)    # <-- Ajoute ceci
custom_admin_site.register(Group, GroupAdmin)
