from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('An Email  is required')
        if not password:
            raise ValueError('A password is requuired')
        email= self.normalize_email(email)
        user= self.model(email=email)
        user.set_password(password)
        user.save()     
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('An Email  is required')
        if not password:
            raise ValueError('A password is requuired')
        user= self.create_user(email, password)
        user.is_superuser= True
        user.save()
        return user
    
# class AppUser(AbstractBaseUser, PermissionsMixin):
#     user_id= models.AutoField(primary_key=True)
#     email= models.EmailField(max_length=50, unique=True)
#     username= models.CharField(max_length=50)
#     # created_at = models.DateTimeField(default=timezone.now)
#     USERNAME_FIELD= 'email'
#     REQUIRED_FIELDS= ['username']
#     objects= AppUserManager()
#     def __str__(self):
#         return self.username
    

class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Kontak(models.Model):
    kontakName = models.CharField(max_length=100)
    kontakImg = models.TextField(null=True)
    kontakDesc = models.TextField()

    def __str__(self):
        return self.name