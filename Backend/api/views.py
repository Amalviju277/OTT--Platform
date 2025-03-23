from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from Admin.models import User,Movie,ViewHistory,Watchlist
from .serializers import UserSerializer, MovieSerializer, HistorySerializer, WatchlistSerializer

# Signup
@api_view(['POST'])
@permission_classes([AllowAny])
def Signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Account created successfully..", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Login
@api_view(['POST'])
@permission_classes([AllowAny])
def Login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)
   # Find the user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'User not exist'}, status=status.HTTP_404_NOT_FOUND)
    # check password 
    if not user.check_password(password):
        return Response({'error': 'Invalid Password'}, status=status.HTTP_404_NOT_FOUND)
    if user.is_blocked:
        return Response({'error' : 'Sorry you have been blocked Please Contact Admin'},status=status.HTTP_404_NOT_FOUND)
    #token
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_200_OK)

#Update Profile
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def Update(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    if not old_password or not new_password:
        return Response({'error': 'Please provide both fields'}, status=status.HTTP_400_BAD_REQUEST)
    # check password 
    if not user.check_password(old_password):
        return Response({'error': 'Old Password is incorrect'},status=status.HTTP_401_UNAUTHORIZED)
    #Change password
    user.set_password(new_password)
    user.save()
    return Response({'Message': 'Your password is updated successfully'}, status=status.HTTP_200_OK)

#logout
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def Logout(request):
    # Get the user token
    token=Token.objects.get(user=request.user)
    token.delete()
    return Response({'Message':'you have logged out successfully'},status=status.HTTP_200_OK)

#MovieList
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def Movie_List(request):
    movies=Movie.objects.all()
    serializer = MovieSerializer(movies,many=True)
    return Response(serializer.data)

#MovieView
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def Movie_View(request,id):
    try:
        movies=Movie.objects.get(id=id)
        serializer=MovieSerializer(movies)
        return Response(serializer.data,status=status.HTTP_200_OK)
    except Movie.DoesNotExist:
        return Response({"error":'Requested movie doesnot exist'},status=status.HTTP_404_NOT_FOUND)

# Add to History
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def Add_History(request):
    # id of user
    user = request.user
    movie_id = request.data.get('id')
    movie = Movie.objects.get(id=movie_id)
    #Create data or checks the table 
    history,_ = ViewHistory.objects.get_or_create(user=user,movie=movie)
    serializer = HistorySerializer(history)
    if not serializer:
        return Response({'error':'There is error in adding to watch history'},serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

#view History
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def View_History(request):
    # user id
    user=request.user
    history=ViewHistory.objects.filter(user=user)
    serializer = HistorySerializer(history,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

# Add to Watchlist
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def Add_Watchlist(request):
    # id of user
    user = request.user
    movie_id = request.data.get('id')
    movie = Movie.objects.get(id=movie_id)
    #Create data or checks the table 
    watchlist,_ = Watchlist.objects.get_or_create(user=user,movie=movie)
    serializer = WatchlistSerializer(watchlist)
    if not serializer:
        return Response({'error':'There is error in adding to watchlist'},serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# View watchlist
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def View_Watchlist(request):
    # user id
    user = request.user
    watchlist = Watchlist.objects.filter(user=user)
    serializer = WatchlistSerializer(watchlist,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)

# Remove Watchlist
@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def Remove_Watchlist(request):
    user = request.user
    movie_id = request.data.get('id') 
    movie = Movie.objects.get(id=movie_id)
    # Check if the watchlist entry exists for this user and movie
    try:
        watchlist = Watchlist.objects.get(user=user, movie=movie)
    except Watchlist.DoesNotExist:
        return Response({'error': 'Movie not in watchlist'}, status=status.HTTP_404_NOT_FOUND)
    watchlist.delete()
    return Response({'message': 'Movie removed from watchlist'}, status=status.HTTP_204_NO_CONTENT)

#Movie Count
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def Movie_Count(request,id):
    movie = Movie.objects.get(id=id)
    movie.view_count += 1
    movie.save()
    return Response({'count': movie.view_count}, status=status.HTTP_200_OK)
