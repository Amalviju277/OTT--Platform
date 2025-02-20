from rest_framework import serializers
from Admin.models import User,Movie,ViewHistory,Watchlist

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    # Password Hashing
    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class HistorySerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='movie.title')
    class Meta:
        model = ViewHistory
        fields = ['user','movie','title','date']

class WatchlistSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='movie.title')
    image = serializers.FileField(source='movie.thumbnail_url')  
    movie_id = serializers.IntegerField(source='movie.id')
    class Meta:
        model = Watchlist
        fields = ['movie_id','user','movie','title','image']


