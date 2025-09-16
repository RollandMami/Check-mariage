from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages
from .form import CustomAuthenticationForm  # Importez votre formulaire
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .models import Invite
from django.shortcuts import get_list_or_404, get_object_or_404
from django.db.models import Sum
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST, require_http_methods
from django.views.decorators.csrf import csrf_exempt 

# Create your views here.
def index(request):
    return render(request, "cheking/index.html")

def get_number_filter(filtre=None, presence=None):
    if filtre:
        if not presence:
            # Utiliser l'agrégation pour sommer le champ 'nombre'
            resultat = Invite.objects.filter(lien_amitie__lien=filtre).aggregate(total=Sum('nombre'))
            # La valeur de `total` peut être None si aucun objet n'est trouvé
            return resultat['total'] or 0
        else:
            # Utiliser l'agrégation pour sommer le champ 'nombre'
            resultat = Invite.objects.filter(lien_amitie__lien=filtre, est_present=presence).aggregate(total=Sum('nombre'))
            # La valeur de `total` peut être None si aucun objet n'est trouvé
            return resultat['total'] or 0

    else:
        if not presence:
            # Calculer le total de tous les invités
            resultat = Invite.objects.aggregate(total=Sum('nombre'))
            return resultat['total'] or 0 
        else:
            # Calculer le total de tous les invités présent
            resultat = Invite.objects.filter(est_present=presence).aggregate(total=Sum('nombre'))
            return resultat['total'] or 0     

@login_required
def dashboard(request):
    # nombre total des invité selon leurs catégories:
    nombre_invite = get_number_filter()
    invite_marie = get_number_filter("MARIE")
    invite_mariee = get_number_filter("MARIEE")
    invite_eglise = get_number_filter("EGLISE")
    invite_ami = get_number_filter("AMIS - COLLEGUES")
    invite_staff = get_number_filter("STAFF - LOGISTICS")

    # nombre des présents selon leurs catégories:
    nombre_invite_present = get_number_filter(presence=1)
    pourcentage_present = (nombre_invite_present / nombre_invite) * 100
    invite_marie_present = get_number_filter(filtre="MARIE", presence=1)
    invite_mariee_present = get_number_filter(filtre="MARIEE", presence=1)
    invite_eglise_present = get_number_filter(filtre="EGLISE", presence=1)
    invite_ami_present = get_number_filter(filtre="AMIS - COLLEGUES", presence=1)
    invite_staff_present = get_number_filter(filtre="STAFF - LOGISTICS", presence=1)

    context = {
        'nombre_invite': nombre_invite,
        'invite_marie': invite_marie,
        'invite_mariee': invite_mariee,
        'invite_eglise': invite_eglise,
        'invite_ami': invite_ami,
        'invite_staff': invite_staff,
        'nombre_invite_present':nombre_invite_present,
        'pourcentage_present':pourcentage_present,
        'invite_marie_present':invite_marie_present,
        'invite_mariee_present':invite_mariee_present,
        'invite_eglise_present':invite_eglise_present,
        'invite_ami_present':invite_ami_present,
        'invite_staff_present':invite_staff_present,
        }
    
    return render(request, 'cheking/dashboard.html', context)

def get_tables(liste):
    tables = set()
    for invite in liste:
        if invite.invitation and invite.invitation.table:
            tables.add(invite.invitation.table.nom)
    return sorted(tables)

def search(request):
    # Cette vue gère la recherche et l'affichage des invités
    code = request.GET.get('code', None)
    
    if code:
        # Si un code est présent dans les paramètres d'URL, on filtre les invités
        invites = Invite.objects.filter(invitation__code=code)
    else:
        # Sinon, on affiche tous les invités
        invites = Invite.objects.all()

    tables = get_tables(invites)
    if not invites.exists():
        messages.error(request, "Aucun invité trouvé avec ce code.")

    context= {
        'tables': tables,
        'invites': invites,}
    # Le template peut maintenant afficher la liste filtrée ou la liste complète
    return render(request, 'cheking/search_invites.html', context)

def process_qr(request, code):
    search_url = reverse('cheking:search')
    # Ajouter le paramètre de requête à l'URL
    final_url = f'{search_url}?code={code}'
    return redirect(final_url)

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

def update_invite(request, code, nom):
    invite = get_object_or_404(Invite, nom=nom, invitation__code=code)
    presence = request.POST.get("est_present")
    nombre = int(request.POST.get("nombre"))

    invite.nombre = nombre
    if presence == 'on':
        invite.est_present = True
    else:
        invite.est_present = False
    
    invite.save()

    return redirect('cheking:dashboard')

# Utilisez require_http_methods pour accepter GET ou POST, ou GET seul
@require_http_methods(["GET"])  
def maj_invite(request, invite_id):
    try:
        # Récupère l'état de la case à cocher depuis les paramètres de requête
        est_present_str = request.GET.get('est_present')
        
        # Convertit la chaîne en booléen
        if est_present_str == 'checked':
            est_present = True
        else:
            est_present = False
            
        invite = get_object_or_404(Invite, pk=invite_id)
        
        invite.est_present = est_present
        invite.save()
        
        return JsonResponse({'status': 'success', 'message': 'La mise à jour a été effectuée avec succès ! ✅'})
    
    except Exception as e:
        # Gérer l'erreur, par exemple, en affichant un message et en redirigeant
        print(f"Erreur lors de la mise à jour : {e}")
        return redirect('cheking:dashboard')

def dashfilter(request, filtre):
    invites = Invite.objects.filter(lien_amitie__lien=str(filtre).upper())
    tables = get_tables(invites)
    context= {
        'tables': tables,
        'invites': invites,
    }
    return render(request, 'cheking/search_invites.html', context)

@require_http_methods(["GET"])
def update_invite_count(request, invite_id):

    try:
        # Récupère le nombre réel de présents depuis les paramètres de requête
        real_count = request.GET.get('count')
        
        # Récupère l'état de la présence (True/False)
        est_present_str = request.GET.get('est_present')
        
        # Vérifie si le nombre est présent et est un nombre
        if real_count is None or not real_count.isdigit():
            return JsonResponse({'status': 'error', 'message': 'Nombre d\'invités invalide.'}, status=400)
        
        # Vérifie si le paramètre de présence est présent
        if est_present_str is None:
            return JsonResponse({'status': 'error', 'message': 'Le statut de présence est manquant.'}, status=400)
            
        invite = get_object_or_404(Invite, pk=invite_id)
        
        # Convertit le nombre en entier et le valide
        new_count = int(real_count)
        
        # S'assurer que le nouveau nombre ne dépasse pas le nombre initial d'invités
        if new_count > invite.nombre or new_count < 0:
            return JsonResponse({'status': 'error', 'message': 'Le nombre de présents ne peut pas dépasser le nombre d\'invités initial.'}, status=400)

        # Met à jour le champ 'nombre_presents'
        invite.nombre_presents = new_count
        
        # Met à jour le champ 'est_present'
        invite.est_present = (est_present_str == 'true')
        
        invite.save()
        
        return JsonResponse({'status': 'success', 'message': 'Mise à jour de la présence et du nombre d\'invités réussie.'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': f'Erreur interne du serveur: {e}'}, status=500)
    
@login_required
def user_profile_view(request):
    user = request.user
    
    # Gère les requêtes POST pour la mise à jour du profil
    if request.method == 'POST':
        # Récupère les données du formulaire
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        
        # Met à jour les champs de l'utilisateur
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save() # Enregistre les modifications dans la base de données
        
        # Ajoute un message de succès
        messages.success(request, 'Votre profil a été mis à jour avec succès !')
        
        # Redirige vers la même page pour afficher les modifications
        return redirect('cheking:profile')

    # Gère les requêtes GET (affichage initial du formulaire)
    context = {
        'first_name' : user.first_name,
        'last_name' : user.last_name,
        'email' : user.email
    }
    
    return render(request, "cheking/profile_view.html", context)





