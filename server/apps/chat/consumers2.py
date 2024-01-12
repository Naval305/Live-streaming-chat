import json
from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "Test-Room"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # message = text_data_json["message"]
        text_data_json["message"]["receiver_channel_name"] = self.channel_name

        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat.message", "received_dict": text_data_json},
        )

    async def chat_message(self, event):
        received_dict = event["received_dict"]

        await self.send(text_data=json.dumps(received_dict))
