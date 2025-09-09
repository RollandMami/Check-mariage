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
    path('search/', views.search, name="search"),  
    path('scan/', views.scanQr, name="scan"),
    path('detail/<str:code>/', views.detail, name="detail"),
    # Page de connexion personnalisée
    path('login/', views.login_view, name="login"),
    path('logout/', auth_views.LogoutView.as_view(next_page="cheking:login"), name='logout'),
    path('api/', include(router.urls)),

]
