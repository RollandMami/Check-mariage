from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class LienAmitie(models.Model):
    lien = models.CharField(max_length=100)
    def __str__(self):
        return self.lien    

class Ville(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.nom

class Quartier(models.Model):
    nom = models.CharField(max_length=100)
    ville = models.ForeignKey(Ville, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.nom}, {self.ville.nom}"

class Tables(models.Model):
    nom = models.CharField(max_length=100)
    
    def __str__(self):
        return f"Table {self.nom}"

class QrCode(models.Model):
    code = models.CharField(max_length=100, unique=True)
    table = models.ForeignKey(Tables, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.code

class Invite(models.Model):
    nom = models.CharField(max_length=100)
    ville = models.ForeignKey(Ville, on_delete=models.CASCADE, null=True, blank=True)
    quartier = models.ForeignKey(Quartier, on_delete=models.CASCADE, null=True, blank=True)
    invitation = models.ForeignKey(QrCode, on_delete=models.CASCADE, related_name='invites')
    nombre = models.IntegerField(default=1)
    est_present = models.BooleanField(default=False)
    attente_de_validation = models.BooleanField(default=False)
    lien_amitie = models.ForeignKey(LienAmitie, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.nom
    
    def clean(self):
        # Récupère la table liée à ce groupe d'invités
        table = self.invitation.table if self.invitation else None
        if table:
            # Calcule le nombre total de personnes déjà sur la table (hors cet objet si update)
            total = sum(
                invite.nombre
                for qr in table.qrcode_set.all()
                for invite in qr.invites.exclude(pk=self.pk)
            )
            if total + self.nombre > 10:
                raise ValidationError("Impossible d'ajouter cet(te) invité(e) : la table dépasserait 10 personnes.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)