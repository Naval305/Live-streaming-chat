from django.http import HttpResponseServerError
from rest_framework.generics import ListAPIView, CreateAPIView

from apps.chat.serializers import (
    ChatGroupSerializer,
    GroupSerializer,
    MessageViewSerializer,
)
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from apps.user.models import User
from apps.chat.models import ChatGroup
from rest_framework import status
from rest_framework.response import Response


# class MessageViewApi(CreateAPIView):
#     serializer_class = MessageSerializer

#     def perform_create(self, serializer):
#         try:
#             receiver_email = serializer.validated_data.get("receiver", None)
#             sender = self.request.user
#             receiver = get_object_or_404(User, email=receiver_email)

#             serializer.save(sender=sender, receiver=receiver)
#         except Exception as e:
#             return HttpResponseServerError(f"Error in creating message: {e}")


class GetMessages(ListAPIView):
    serializer_class = MessageViewSerializer

    def get_queryset(self):
        return User.objects.filter(
            email__in=[
                self.request.query_params["user"],
                self.request.query_params["logged_user"],
            ]
        )


class GetGroupViewApi(ListAPIView):
    serializer_class = GroupSerializer
    queryset = ChatGroup.objects.all()


class CreateGroupViewApi(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ChatGroupSerializer(data=request.data)

        if serializer.is_valid():
            chat_group = ChatGroup.objects.create(
                name=serializer.validated_data["name"]
            )

            members_data = serializer.validated_data["members"]
            for member_data in members_data:
                user, created = User.objects.get_or_create(email=member_data["email"])
                chat_group.members.add(user)

            return Response(
                {"success": True, "message": "ChatGroup created successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"success": False, "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
