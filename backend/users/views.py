from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .serializers import UserSerializer

# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(id=response.data['id'])
        token, created = Token.objects.get_or_create(user=user)
        response.data['token'] = token.key

        return response

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
            request.user.auth_token.delete()
            return Response(
                {"detail": "Logged out successfully."}, 
                status=status.HTTP_200_OK
            )
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)