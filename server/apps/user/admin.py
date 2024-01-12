from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class CustomUserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "online",
        "status",
        "photo",
    )
    search_fields = ("email", "first_name", "last_name")
    ordering = ("email",)

    list_filter = ("online",)
    readonly_fields = ["date_joined"]

    fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email' , 'password', 'online', 'status', 'photo', 'is_superuser', 'groups'),
        }),    
    )




admin.site.register(User, CustomUserAdmin)
