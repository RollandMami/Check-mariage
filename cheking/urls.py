from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = "cheking"

urlpatterns = [
    path('', views.index, name="index"),
    path('dashboard/', views.dashboard, name="dashboard"),
    path('search/', views.search, name="search"),  
    path('scan/', views.scanQr, name="scan"),
    path('detail/<str:code>/', views.detail, name="detail"),
    # Page de connexion personnalisée
    path('login/', views.login_view, name="login"),
    path('logout/', auth_views.LogoutView.as_view(next_page="cheking:login"), name='logout'),

]
