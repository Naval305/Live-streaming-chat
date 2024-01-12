from django.urls import re_path


websocket_urlpatterns = [
    re_path(r"ws/call/<str:peerId>", MessageConsumer.as_asgi()),
]