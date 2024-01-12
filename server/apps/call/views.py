from rest_framework.views import APIView
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from rest_framework.response import Response

from apps.call.serializers import StartCallSerializer
from apps.user.models import User
from apps.user.serializers import UserSerializer

# Create your views here.


class StartCall(APIView):
    def post(self, request, format=None):
        serializer = StartCallSerializer(data=request.data)
        if serializer.is_valid():
            sender_user = User.objects.get(email=serializer.validated_data["sender"])
            channel_layer = get_channel_layer()
            chat_room_name = "chat_%s" % serializer.validated_data["receiver"]
            if "@" in chat_room_name:
                chat_room_name = (
                    chat_room_name.split("@")[0] + chat_room_name.split("@")[1]
                )

            async_to_sync(channel_layer.group_send)(
                chat_room_name,
                {
                    "type": "new_call",
                    "message": {
                        "data": serializer.validated_data,
                        "display": UserSerializer(
                            sender_user, context={"request": request}
                        ).data,
                    },
                },
            )
            return Response({"abcd": "test"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EndCall(APIView):
    def post(self, request, format=None):
        serializer = StartCallSerializer(data=request.data)
        if serializer.is_valid():
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "chat_%s" % serializer.validated_data["peer_id"],
                {
                    "type": "end_call",
                    "message": {
                        "data": serializer.validated_data,
                    },
                },
            )
            return Response({"hello": "world"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
