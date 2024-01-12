from django.urls import path
from .views import *


urlpatterns = [
    #   path("message", MessageViewApi.as_view(), name="message_view"),
    path("group-message", GetGroupViewApi.as_view(), name="message_view"),
    path("create-group", CreateGroupViewApi.as_view(), name="create_group"),
    path("messages", GetMessages.as_view(), name="get_messages"),
]
