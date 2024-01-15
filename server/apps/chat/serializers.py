from rest_framework import serializers
from apps.chat.models import ChatGroup, Message
from apps.user.models import User
from django.db.models import Q


class MessageModelSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(read_only=True)
    receiver = serializers.EmailField(read_only=True)
    read = serializers.BooleanField(default=True)

    class Meta:
        model = Message
        fields = ("text", "sender", "date_time", "read", "receiver")


# class MessageSerializer(serializers.ModelSerializer):
#     sender = serializers.EmailField(read_only=True)
#     receiver = serializers.EmailField()
#     read = serializers.BooleanField(read_only=True)

#     class Meta:
#         model = Message
#         fields = ("text", "date_time", "sender", "receiver", "read")
#         read_only_fields = [
#             "date_time",
#         ]


class GroupSerializer(serializers.ModelSerializer):
    member_names = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = ChatGroup
        fields = ("id", "name", "member_names", "messages")

    def get_member_names(self, obj):
        return obj.members.values()

    def get_messages(self, obj):
        return (
            Message.objects.filter(receiver_group_id=obj.id)
            .values("sender__email", "text", "date_time")
            .order_by("date_time")
        )


class ChatGroupSerializer(serializers.ModelSerializer):
    from apps.user.serializers import UserGroupSerializer

    members = UserGroupSerializer(many=True)

    class Meta:
        model = ChatGroup
        fields = ["name", "members"]


from rest_framework.pagination import PageNumberPagination


class CustomMessagesPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = "page"
    max_page_size = 200


class MessageViewSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(read_only=True)
    receiver = serializers.CharField(read_only=True)
    class Meta:
        model = Message
        fields = (
            "text",
            "sender",
            "receiver",
            "date_time",
        )



    # def get_messages(self, obj):
    #     messages = (
    #         Message.objects.filter(
    #             Q(receiver=obj, sender=self.context["request"].user.id)
    #             | Q(sender=obj, receiver=self.context["request"].user.id)
    #         )
    #         .prefetch_related("sender", "receiver")
    #         .order_by("date_time")
    #     )

    #     paginator = CustomMessagesPagination()
    #     paginated_messages = paginator.paginate_queryset(
    #         messages, self.context["request"]
    #     )

    #     serializer = MessageModelSerializer(messages, many=True)
    #     return serializer.data
