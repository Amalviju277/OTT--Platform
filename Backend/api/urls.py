from django.urls import path
from . import views

urlpatterns = [

    path('signup/', views.Signup,name='signup'),
    path('login/',views.Login,name='login'),
    path('update/',views.Update,name='update'),
    path('logout/',views.Logout,name='logout'),
    path('movie_list/',views.Movie_List,name='movielist'),
    path('movie_view/<int:id>/',views.Movie_View,name='movieview'),
    path('add_history/',views.Add_History,name='add_history'),
    path('view_history/',views.View_History,name='view_history'),
    path('add_watchlist/',views.Add_Watchlist,name='add_watchlist'),
    path('view_watchlist/',views.View_Watchlist,name='view_watchlist'),
    path('remove_watchlist/',views.Remove_Watchlist,name='remove_watchlist'),
    path('movie_count/<int:id>/',views.Movie_Count,name='movie_count'),
    
]