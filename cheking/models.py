from django.db import models

# Create your models here.
class Tables(models.Model):
    nom = models.CharField(max_length=100)
    
    def __str__(self):
        return f"Table {self.nom}"

class QrCode(models.Model):
    code = models.CharField(max_length=100)
    table = models.ForeignKey(Tables, on_delete=models.CASCADE, null=True, blank=True)
    
    def __str__(self):
        return self.code

class Invite(models.Model):
    nom = models.CharField(max_length=100)
    invitation = models.ForeignKey(QrCode, on_delete=models.CASCADE, related_name='invites')
    nombre = models.IntegerField(max_length=2, default=1)
    est_present = models.BooleanField(default=False)
    attente_de_validation = models.BooleanField(default=False)
    
    def __str__(self):
        return self.nom