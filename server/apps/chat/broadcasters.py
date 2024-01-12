from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.chat.serializers import MessageModelSerializer


class MessageBroadcaster:
    def __init__(self):
        pass

    def broadcast(self, message_instance):
        serializer = MessageModelSerializer(message_instance, many=False)
        n_message = serializer.data
        if n_message["receiver"] != None:
            del n_message["receiver"]
            n_message["read"] = False
            channel_layer = get_channel_layer()
            receiver = message_instance.receiver.email
            chat_room_name = "chat_%s" % receiver
            if "@" in chat_room_name:
                chat_room_name = (
                    chat_room_name.split("@")[0] + chat_room_name.split("@")[1]
                )

            async_to_sync(channel_layer.group_send)(
                chat_room_name,
                {"type": "new_message", "message": n_message},
            )
