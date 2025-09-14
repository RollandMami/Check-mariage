from django.urls import path, include
from . import views
from django.contrib.auth import views as auth_views
from rest_framework.routers import DefaultRouter
from .views_api import (
    LienAmitieViewSet, VilleViewSet, QuartierViewSet,
    TablesViewSet, QrCodeViewSet, InviteViewSet
)

app_name = "cheking"

router = DefaultRouter()
router.register(r'lien-amitie', LienAmitieViewSet)
router.register(r'villes', VilleViewSet)
router.register(r'quartiers', QuartierViewSet)
router.register(r'tables', TablesViewSet)
router.register(r'qrcodes', QrCodeViewSet)
router.register(r'invites', InviteViewSet)

urlpatterns = [
    path('', views.index, name="index"),
    path('dashboard/', views.dashboard, name="dashboard"),
    # URL de la page de recherche. On ne définit pas de paramètre ici
    # car les filtres seront passés via les paramètres de requête (?code=...)
    path('search/', views.search, name="search"),
    path('scan/', views.scanQr, name="scan"),
    path('detail/<str:code>/', views.detail, name="detail"),
    path('login/', views.login_view, name="login"),
    path('logout/', auth_views.LogoutView.as_view(next_page="cheking:index"), name='logout'),
    # L'URL de process_qr n'a pas besoin d'être un paramètre
    # puisqu'on la redirige vers la vue 'search'
    path('process_qr/<str:code>/', views.process_qr, name="process_qr"),
    path('update_invite/<str:code>/<str:nom>/', views.update_invite, name="update_invite"),
    path('maj_invite/<int:invite_id>/', views.maj_invite, name='maj_invite'),
    path('dashfilter/<str:filtre>/',views.dashfilter, name="dashfilter"),
    path('update_invite_count/<int:invite_id>/', views.update_invite_count, name="update_invite_count"),
]
