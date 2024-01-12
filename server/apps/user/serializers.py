from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from apps.chat.models import Message
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from apps.chat.serializers import MessageModelSerializer

from .models import User


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["user_details"] = self.user.email
        self.__change_status()
        return data

    def __change_status(self):
        from apps.user.utils import notify_others

        self.user.online = True
        self.user.save()
        notify_others(self.user)


class RegistarationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        required=True, write_only=True, validators=[validate_password]
    )
    confirm_pass = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password", "confirm_pass")

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_pass"]:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        self.__notify_others(user)
        return user

    async def __notify_others(self, user):
        serializer = UserSerializer(user, many=False)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notification",
            {"type": "new_user_notification", "message": serializer.data},
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "status", "online", "first_name", "last_name"]


class UserGroupSerializer(serializers.Serializer):
    email = serializers.EmailField()

    
class UserViewSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "online",
            "status",
            "photo",
            "messages",
        )

    def get_messages(self, obj):
        messages = (
            Message.objects.filter(
                Q(receiver=obj, sender=self.context["request"].user.id)
                | Q(sender=obj, receiver=self.context["request"].user.id)
            )
            .prefetch_related("sender", "receiver")
            .order_by("date_time")
        )

        serializer = MessageModelSerializer(messages, many=True)
        return serializer.data