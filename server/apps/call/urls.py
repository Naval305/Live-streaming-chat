from django.urls import path
from .views import *


urlpatterns = [
    path("start-call", StartCall.as_view()),
    path("end-call", EndCall.as_view()),
]
