import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class NewUserConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "new_user"
        self.room_group_name = "notification"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()


    async def receive(self, text_data):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "new_user_notification",
                "message": json.loads(text_data)["message"],
            },
        )

    async def new_user_notification(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"message": message, "status": "new_user"})
        )

    async def user_online(self, event):
        message = event["message"]
        await self.send(
            text_data=json.dumps({"message": message, "status": "status_change"})
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
