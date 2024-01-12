from django.urls import path
from .views import *


urlpatterns = [
    path("login", LoginApiView.as_view(), name="login"),
    path("registration", RegistrationApiView.as_view(), name="signup"),
    path("users", UserView.as_view(), name="user_view")
]