from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView, ListAPIView

from apps.user.utils import notify_others
from .models import User
from .serializers import LoginSerializer, RegistarationSerializer, UserViewSerializer


class LoginApiView(TokenObtainPairView):
    permission_classes = ()
    serializer_class = LoginSerializer

    def __change_status(self, user):
        profile = user.profile
        profile.online = True
        profile.save()
        notify_others(user)

    def perform_create(self, serializer):
        self.__change_status(self.request.user)
        response = super().perform_create(serializer)
        return response


class RegistrationApiView(CreateAPIView):
    permission_classes = ()
    queryset = User.objects.all()
    serializer_class = RegistarationSerializer


class UserView(ListAPIView):
    serializer_class = UserViewSerializer

    def get_queryset(self):
        return User.objects.exclude(email=self.request.user)
