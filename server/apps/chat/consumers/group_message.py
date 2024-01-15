import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from apps.call.serializers import GroupCallSerializer
from apps.user.serializers import UserSerializer
from apps.user.models import User


class GroupChat(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope["url_route"]["kwargs"]["group_id"]
        self.room_group_name = "chat_%s" % self.group_id
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "call" in data:
            chat_room_name = "chat_" + self.group_id
            serializer = GroupCallSerializer(data=data)
            if serializer.is_valid():
                sender_user = await self.__get_user_by_email(data["sender"])
                await self.channel_layer.group_send(
                    chat_room_name,
                    {
                        "type": "new_call",
                        "message": {
                            "data": data,
                            "display": UserSerializer(sender_user).data,
                        },
                    },
                )
        else:
            await self.channel_layer.group_send(
                "chat_" + str(data["sender_group"]),
                {"type": "new_message", "message": data},
            )
            await self.__save_message(data)

    async def new_message(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"message": message, "status": "new_message"})
        )

    async def new_call(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"message": message, "status": "new_call"})
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    @database_sync_to_async
    def __save_message(self, message):
        from apps.chat.models import Message
        from apps.user.models import User
        from apps.chat.models import ChatGroup

        try:
            sender = User.objects.get(email=message["sender"])
        except:
            sender = User.objects.get(email=message["sender__email"])
        receiver_group = ChatGroup.objects.get(id=self.group_id)
        Message.objects.create(
            sender=sender, text=message["text"], receiver_group=receiver_group
        )

    @database_sync_to_async
    def __get_user_by_email(self, email):
        return User.objects.get(email=email)
