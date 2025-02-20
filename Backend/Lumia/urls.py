from django.contrib import admin
from django.urls import path
from Admin import views
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    path('',views.Login,name='Login'),
    path('profile/',views.Update_profile,name='profile'),
    path('Logout/',views.Logout,name='Logout'),
    path('movie_list/',views.Movie_list,name='list'),
    path('create/',views.Create,name='create'),
    path('edit/<int:movie_id>/', views.edit_movie, name='edit_movie'),
    path('delete/<int:id>',views.Delete,name='delete'),
    path('view/<int:id>',views.Movie_Show,name='view'),
    path('user/',views.User_Details,name='user'),
    path('user_history/<int:id>',views.User_History,name='user_history'),
    path('count/',views.count,name='count'),
    path('block/<int:id>',views.Block,name='block'),
    path('unblock/<int:id>',views.Unblock,name='unblock'),   
    path('api/',include('api.urls'))
    
]
# 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
