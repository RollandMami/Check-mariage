from django.urls import path
from . import views
from django.contrib import auth

urlpatterns = [
    path('', views.index, name="index"),
]
