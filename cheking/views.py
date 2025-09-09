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
    invites = get_list_or_404(Invite)
    nombre_invite = 0
    invite_marie = 0
    invite_mariee = 0
    invite_eglise = 0
    invite_ami = 0
    invite_staff = 0

    for elm in invites:
        nombre_invite += elm.nombre
        if elm.lien_amitie == "MARIE":
            invite_marie += elm.nombre
        elif elm.lien_amitie == "mariee":
            invite_mariee += elm.nombre
        elif elm.lien_amitie == "eglise":
            invite_eglise += elm.nombre
        elif elm.lien_amitie == "ami":
            invite_ami += elm.nombre
        elif elm.lien_amitie == "staff":
            invite_staff += elm.nombre
    return render(request, 'cheking/dashboard.html', {
        'invites': invites,
        'nombre_invite': nombre_invite,
        'invite_marie': invite_marie,
        'invite_mariee': invite_mariee,
        'invite_eglise': invite_eglise,
        'invite_ami': invite_ami,
        'invite_staff': invite_staff})

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
