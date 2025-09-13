"""
URL configuration for mariage project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from cheking.admin import custom_admin_site
from django.views.generic import RedirectView

urlpatterns = [
    # Redirige l'URL racine vers l'URL de l'application 'cheking'
    path('', RedirectView.as_view(url='cheking/', permanent=True)),
    path('cheking/', include('cheking.urls', namespace='cheking')),
    path('admin/', custom_admin_site.urls),
    
]

