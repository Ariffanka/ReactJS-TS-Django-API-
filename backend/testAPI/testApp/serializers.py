from testApp.models import Item, Kontak
from rest_framework import serializers
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model, authenticate

UserModel= get_user_model()

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields='__all__'
    def create(self,clean_data):
        user_obj= UserModel.objects.create_user(email=clean_data['email'],
                                                username= clean_data['email'],
                                                password= clean_data['password'],)
        # user_obj.username= clean_data['username']
        user_obj.save()
        return user_obj

class LoginUserSerializer(serializers.Serializer):
    email= serializers.EmailField()
    password= serializers.CharField()
    
    class Meta:  # Perbaiki typo di sini, ubah dari 'class meta' menjadi 'class Meta'
        fields = ['email', 'password']

    def chechk_user(self, clean_data):
        user= authenticate(username= clean_data['email'], password= clean_data['password'])
        
        if not user:
            raise ValueError('user not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model: UserModel
        fields= ['email', 'username']


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['id','name', 'description', 'price']
        
class KontakSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model= Kontak
        fields= ['id','kontakName','kontakImg','kontakDesc',]
        
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
