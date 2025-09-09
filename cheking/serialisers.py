from rest_framework import serializers
from .models import LienAmitie, Ville, Quartier, Tables, QrCode, Invite

class LienAmitieSerializer(serializers.ModelSerializer):
    class Meta:
        model = LienAmitie
        fields = '__all__'

class VilleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ville
        fields = '__all__'

class QuartierSerializer(serializers.ModelSerializer):
    ville = VilleSerializer(read_only=True)
    ville_id = serializers.PrimaryKeyRelatedField(
        queryset=Ville.objects.all(), source='ville', write_only=True
    )

    class Meta:
        model = Quartier
        fields = ['id', 'nom', 'ville', 'ville_id']

class TablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tables
        fields = '__all__'

class QrCodeSerializer(serializers.ModelSerializer):
    table = TablesSerializer(read_only=True)
    table_id = serializers.PrimaryKeyRelatedField(
        queryset=Tables.objects.all(), source='table', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = QrCode
        fields = ['id', 'code', 'table', 'table_id']

class InviteSerializer(serializers.ModelSerializer):
    ville = VilleSerializer(read_only=True)
    ville_id = serializers.PrimaryKeyRelatedField(
        queryset=Ville.objects.all(), source='ville', write_only=True, allow_null=True, required=False
    )
    quartier = QuartierSerializer(read_only=True)
    quartier_id = serializers.PrimaryKeyRelatedField(
        queryset=Quartier.objects.all(), source='quartier', write_only=True, allow_null=True, required=False
    )
    invitation = QrCodeSerializer(read_only=True)
    invitation_id = serializers.PrimaryKeyRelatedField(
        queryset=QrCode.objects.all(), source='invitation', write_only=True
    )
    lien_amitie = LienAmitieSerializer(read_only=True)
    lien_amitie_id = serializers.PrimaryKeyRelatedField(
        queryset=LienAmitie.objects.all(), source='lien_amitie', write_only=True, allow_null=True, required=False
    )

    class Meta:
        model = Invite
        fields = [
            'id', 'nom', 'ville', 'ville_id', 'quartier', 'quartier_id',
            'invitation', 'invitation_id', 'nombre', 'est_present',
            'attente_de_validation', 'lien_amitie', 'lien_amitie_id'
        ]