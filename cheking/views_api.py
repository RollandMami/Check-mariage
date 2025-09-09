from rest_framework import viewsets
from .models import LienAmitie, Ville, Quartier, Tables, QrCode, Invite
from .serialisers import (
    LienAmitieSerializer,
    VilleSerializer,
    QuartierSerializer,
    TablesSerializer,
    QrCodeSerializer,
    InviteSerializer,
)

class LienAmitieViewSet(viewsets.ModelViewSet):
    queryset = LienAmitie.objects.all()
    serializer_class = LienAmitieSerializer

class VilleViewSet(viewsets.ModelViewSet):
    queryset = Ville.objects.all()
    serializer_class = VilleSerializer

class QuartierViewSet(viewsets.ModelViewSet):
    queryset = Quartier.objects.all()
    serializer_class = QuartierSerializer

class TablesViewSet(viewsets.ModelViewSet):
    queryset = Tables.objects.all()
    serializer_class = TablesSerializer

class QrCodeViewSet(viewsets.ModelViewSet):
    queryset = QrCode.objects.all()
    serializer_class = QrCodeSerializer

class InviteViewSet(viewsets.ModelViewSet):
    queryset = Invite.objects.all()
    serializer_class = InviteSerializer