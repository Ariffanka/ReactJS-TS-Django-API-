from django.shortcuts import render
from testApp.models import Item, Kontak
from rest_framework import viewsets, permissions, status
from testApp.serializers import ItemSerializer, UserSerializer, GroupSerializer, KontakSerializer, LoginUserSerializer, RegisterUserSerializer
from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# from .validations import custom_validation

# Create your views here.
class UserRegister(APIView):
    permission_classes= (permissions.AllowAny,)
    def post(self,request):
        data= request.data
        serializer= RegisterUserSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user= serializer.create(data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
class UserLogin(APIView):
    permission_classes= (permissions.AllowAny,)
    authentication_classes= [SessionAuthentication]
    
    def post(self, request):
        data= request.data
        serializers= LoginUserSerializer(data=data)
        if serializers.is_valid(raise_exception=True):
            user= serializers.chechk_user(data)
            login(request, user)
            token, _=Token.objects.get_or_create(user=user)
            return Response({'token':token.key}, status=status.HTTP_200_OK)
            
class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class UserView(APIView):
    permission_classes=(permissions.IsAuthenticated,)
    authentication_classes= [SessionAuthentication]
    
    def get(self, request):
        serializer= UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = [permissions.IsAuthenticated]
    
class KontakViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes= (permissions.AllowAny,)
    queryset = Kontak.objects.all()
    serializer_class = KontakSerializer

    # @csrf_exempt
    # def your_delete_view(self, request, id):
    #     if request.method == 'DELETE':
    #         try:
    #             obj = Kontak.objects.get(id=id)
    #             obj.delete()
    #             return JsonResponse({'message': 'Delete successful'}, status=200)
    #         except Kontak.DoesNotExist:
    #             return JsonResponse({'error': 'Object not found'}, status=404)
    #     else:
    #         return JsonResponse({'error': 'Invalid method'}, status=400)

    
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    # queryset = AppUser.objects.all().order_by('-created_at')
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # permission_classes = [permissions.IsAuthenticated]
