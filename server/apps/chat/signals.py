from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

from .models import Message
from .broadcasters import MessageBroadcaster


# @receiver(post_save, sender=Message)
# def trigger_broadcast(instance, created, **kwargs):

#     if created:
#         @transaction.on_commit
#         def on_commit_callback():
#             message_broadcaster = MessageBroadcaster(instance)
#             message_broadcaster.broadcast()

#         on_commit_callback()


@receiver(post_save, sender=Message)
def trigger_broadcast(instance, created, **kwargs):
    if created:
        message_broadcaster = MessageBroadcaster()
        message_broadcaster.broadcast(instance)
