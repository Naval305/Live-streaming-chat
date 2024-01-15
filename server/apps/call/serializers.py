from rest_framework import serializers


class StartCallSerializer(serializers.Serializer):
    receiver = serializers.EmailField()
    sender = serializers.EmailField()
    peer_id = serializers.CharField()


class GroupCallSerializer(serializers.Serializer):
    sender_group: serializers.IntegerField()
    sender: serializers.EmailField()
    peer_id: serializers.CharField()
    call: serializers.BooleanField()
