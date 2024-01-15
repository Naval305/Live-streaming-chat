from django.contrib import admin

from apps.chat.models import ChatGroup, Message

# Register your models here.


class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "text",
        "date_time",
        "sender",
        "receiver",
        "receiver_group"
    )


class ChatGroupAdmin(admin.ModelAdmin):
    list_display = ("name",)


admin.site.register(Message, MessageAdmin)
admin.site.register(ChatGroup, ChatGroupAdmin)
