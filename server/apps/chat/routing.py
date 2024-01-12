from django.urls import re_path

from apps.chat.consumers.message import MessageConsumer
from apps.chat.consumers.notification import NewUserConsumer
from apps.chat.consumers.group_message import GroupChat


websocket_urlpatterns = [
    re_path(r"ws/message/(?P<email>[\w.@+-]+)", MessageConsumer.as_asgi()),
    re_path("ws/notification", NewUserConsumer.as_asgi()),
    re_path(r"^ws/group_chat/(?P<group_id>\d+)$", GroupChat.as_asgi()),
]
