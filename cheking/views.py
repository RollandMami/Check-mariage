from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages
from .form import CustomAuthenticationForm  # Importez votre formulaire
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .models import Invite
from django.shortcuts import get_list_or_404, get_object_or_404

# Create your views here.
def index(request):
    return render(request, "cheking/index.html")

@login_required
def dashboard(request):
    return render(request, 'cheking/dashboard.html')

def search(request):
    # cette vue affiche la liste des invités
    invites = get_list_or_404(Invite)
    return render(request, 'cheking/search_invites.html', {'invites': invites})

def scanQr(request):
    # cette vue permet de scanner le QR code
    return render(request, 'cheking/scan.html')

def detail(request, code):
    # cette vue affiche le détail d'un invité
    invite = get_object_or_404(Invite, pk=code)
    return render(request, 'cheking/detail.html', context={"invite":invite})

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('cheking:dashboard') # Remplacez 'index' par le nom de votre page d'accueil
            else:
                messages.error(request, "Nom d'utilisateur ou mot de passe incorrect.")
    else:
        form = CustomAuthenticationForm()

    return render(request, 'cheking/login.html', {'form': form})
