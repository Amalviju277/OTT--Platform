from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth import login,authenticate,update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib import messages
from .models import User,Movie,ViewHistory
from .forms import MovieForm
from django.core.paginator import Paginator
IMAGE_FILE_TYPES = ['png', 'jpg', 'jpeg'] #Image file types

#Login
def Login(request): 
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")
        # Authenticate user
        user = authenticate(request, email=email, password=password)
        if user is not None:
            # Check if the user is an admin
            if user.is_superuser:
                login(request, user)
                return redirect("list") 
            else:
                messages.error(request, "Invalid email or password")         
    return render(request, "login.html")

#update Profile
@login_required(login_url= 'Login')
def Update_profile(request):
    if request.method == "POST":
        current_password = request.POST.get("current_password")
        new_password = request.POST.get("new_password")    
        conf_password = request.POST.get("conf_password")
        user = request.user
        if user.check_password(current_password):
            if new_password == conf_password:
                user.set_password(new_password)
                user.save()
                update_session_auth_hash(request, user) # Prevent user from being logged out
                return redirect("list")
            else:
                messages.error(request, "Passwords do not match")
        else:
            messages.error(request, "Invalid password")
    return render(request,'update_profile.html')

#Logout
@login_required(login_url = 'Login')
def Logout(request):
    logout(request)
    return redirect("Login")

#Movie List 
@login_required(login_url='Login')
def Movie_list(request):
    search = request.GET.get('query','') #Get search query
    movies = Movie.objects.all()
    if search:
        movies = movies.filter(title__icontains=search) # search by movie title

    paginator = Paginator(movies, 10)  # Set the number of items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'Movies/list.html', {'page_obj': page_obj,'search':search})

#Create Movies
@login_required(login_url = 'Login')
def Create(request):
    if request.method == "POST":
        form = MovieForm(request.POST,request.FILES)    
        if form.is_valid():
            form.save()
            return redirect("list")
    else:
        form = MovieForm()
    return render(request,'Movies/create.html',{'form':form})

#Edit 
@login_required(login_url = 'Login')
def edit_movie(request, movie_id):
    # Get movie by ID
    movie = get_object_or_404(Movie, id=movie_id)  
    if request.method == "POST":
        form = MovieForm(request.POST, request.FILES, instance=movie)
        if form.is_valid():
            form.save()
            return redirect('list') 
    else:
        form = MovieForm(instance=movie)
    return render(request, 'Movies/edit.html', {'form': form, 'movie': movie})


#Delete
@login_required(login_url = 'Login')
def Delete(request,id):
    movie = Movie.objects.get(id=id)
    movie.delete()    
    return redirect('list')

# View Movie
@login_required(login_url = 'Login')
def Movie_Show(request,id):
    movie = Movie.objects.get(id=id) 
    return render(request,'Movies/view.html',{'movie':movie})
  
#User Detail
@login_required(login_url = 'Login')
def User_Details(request):
    search = request.GET.get('query','') #Get search query
    users = User.objects.exclude(is_admin=True)
    if search:
        users = users.filter(email__icontains=search) # search by users email

    paginator = Paginator(users, 10)  # Set the number of items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request,'user-details.html',{'page_obj':page_obj, 'search':search})

#User History
@login_required(login_url = 'Login')
def User_History(request,id):
    #Get user history
    user_detail = ViewHistory.objects.select_related('movie','user').filter(user=id).order_by('movie_id')
    paginator = Paginator(user_detail, 10)  # Set the number of items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request,'user-history.html',{'user_detail':user_detail,'page_obj':page_obj})

#Movie Count
@login_required(login_url = 'Login')
def count(request):
    search = request.GET.get('query','') #Get search query
    movie = Movie.objects.all().order_by('-view_count')
    if search:
        movie = movie.filter(title__icontains=search) # search by movie title

    paginator = Paginator(movie, 10)  # Set the number of items per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request,'count.html',{'page_obj':page_obj, 'search':search})

#Block user
@login_required(login_url = 'Login')
def Block(request,id):
    user = User.objects.get(id=id)
    user.is_blocked = True
    user.save()
    return redirect('user')

#Unblock user
@login_required(login_url = 'Login')
def Unblock(request,id):
    user = User.objects.get(id=id)
    user.is_blocked = False
    user.save()
    return redirect('user')
