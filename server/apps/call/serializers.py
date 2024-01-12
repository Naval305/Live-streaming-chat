from rest_framework import serializers


class StartCallSerializer(serializers.Serializer):
    receiver = serializers.EmailField()
    sender = serializers.EmailField()
    peer_id = serializers.CharField()
