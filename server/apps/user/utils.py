from apps.user.models import User
from apps.user.serializers import UserSerializer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def notify_others(user: User):
    serializer = UserSerializer(user, many=False)
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "notification", {"type": "user_online", "message": serializer.data}
    )
