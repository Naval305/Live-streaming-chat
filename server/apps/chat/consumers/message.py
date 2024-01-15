import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from apps.user.models import User
from apps.call.serializers import StartCallSerializer
from apps.user.serializers import UserSerializer


class MessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["email"]
        chat_room_name = "chat_%s" % self.room_name
        if "@" in chat_room_name:
            self.room_group_name = (
                chat_room_name.split("@")[0] + chat_room_name.split("@")[1]
            )
        else:
            self.room_group_name = chat_room_name
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        await self.__change_status(status=True)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "data" in data:
            if "end_call" in data["data"]:
                del data["data"]["end_call"]
                serializer = StartCallSerializer(data=data["data"])
                if serializer.is_valid():
                    await self.channel_layer.group_send(
                        "chat_%s" % serializer.validated_data["receiver"].split("@")[0]
                        + serializer.validated_data["receiver"].split("@")[1],
                        {
                            "type": "end_call",
                            "message": {
                                "data": serializer.validated_data,
                            },
                        },
                    )
            else:
                chat_room_name = (
                    "chat_"
                    + data["data"]["receiver"].split("@")[0]
                    + data["data"]["receiver"].split("@")[1]
                )
                serializer = StartCallSerializer(data=data["data"])
                if serializer.is_valid():
                    sender_user = await self.__get_user_by_email(
                        serializer.validated_data["sender"]
                    )
                await self.channel_layer.group_send(
                    chat_room_name,
                    {
                        "type": "new_call",
                        "message": {
                            "data": serializer.validated_data,
                            "display": UserSerializer(sender_user).data,
                        },
                    },
                )
        elif "typing" in data:
            await self.channel_layer.group_send(
                "chat_"
                + data["receiver"].split("@")[0]
                + data["receiver"].split("@")[1],
                {
                    "type": "typing",
                    "receiver": data["receiver"],
                    "is_typing": data["typing"],
                    "sender": data["sender"],
                },
            )
        else:
            await self.__save_message(data)

    async def typing(self, event):
        is_typing = event["is_typing"]
        await self.send(
            text_data=json.dumps(
                {"typing": is_typing, "status": "typing", "sender": event["sender"]}
            )
        )

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

    async def end_call(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"message": message, "status": "end_call"})
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.__change_status(status=False)

    @database_sync_to_async
    def __save_message(self, message):
        from apps.chat.models import Message
        from apps.user.models import User

        sender = User.objects.get(email=message["sender"])
        receiver = User.objects.get(email=message["receiver"])
        Message.objects.create(sender=sender, receiver=receiver, text=message["text"])

    @database_sync_to_async
    def __change_status(self, status):
        from apps.user.utils import notify_others

        user = User.objects.get(email=self.room_name)
        user.online = status
        user.save()
        notify_others(user)

    @database_sync_to_async
    def __get_user_by_email(self, email):
        return User.objects.get(email=email)
