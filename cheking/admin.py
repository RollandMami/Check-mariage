from django.contrib import admin
from .models import *

class QrAdmin(admin.ModelAdmin):
    list_display=("code", "table")
    search_fields = ("code",)
    list_filter = ("code",)

class InviteAdmin(admin.ModelAdmin):
    list_display = ("nom", "invitation", "nombre", "ville", "quartier","est_present", "attente_de_validation")
    search_fields = ("nom", "invitation__code", "ville__nom", "quartier__nom")
    list_filter = ("est_present", "attente_de_validation", "ville", "quartier")


# Register your models here.
admin.site.register(Ville)
admin.site.register(Quartier)
admin.site.register(Invite, InviteAdmin)
admin.site.register(QrCode, QrAdmin)
admin.site.register(Tables)
admin.site.register(LienAmitie)