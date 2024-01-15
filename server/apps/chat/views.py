import json
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

from apps.chat.models import Message
from django.db.models import Q


class GetMessages(ListAPIView):
    serializer_class = MessageViewSerializer

    def get_queryset(self):
        messages = (
            Message.objects.filter(receiver_group=None)
            .filter(
                Q(
                    receiver__email=self.request.query_params["receiver"],
                    sender=self.request.user.id,
                )
                | Q(
                    sender__email=self.request.query_params["receiver"],
                    receiver=self.request.user.id,
                )
            )
            .prefetch_related("sender", "receiver")
            .order_by("-date_time")
        )

        messages = messages.exclude(id=messages.first().id)
        return messages


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
