from django.db import models
from django.contrib.auth.models import Group

from apps.user.models import User


class ChatGroup(models.Model):
    # group = models.OneToOneField(
    #     Group, on_delete=models.CASCADE, related_name="chat_group"
    # )
    members = models.ManyToManyField(User, related_name="group_members")
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name


# Create your models here.
class Message(models.Model):
    text = models.TextField()
    date_time = models.DateTimeField(auto_now_add=True, blank=True)
    sender = models.ForeignKey(User, related_name="sender", on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name="receiver", on_delete=models.CASCADE, null=True, blank=True
    )
    receiver_group = models.ForeignKey(
        ChatGroup, null=True, blank=True, on_delete=models.SET_NULL
    )

    # def __str__(self):
    #     return f"From {self.sender.email} to {self.receiver.email}"

    class Meta:
        ordering = ["-date_time"]
