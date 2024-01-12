from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)
from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    online = models.BooleanField(default=False)
    status = models.CharField(default="Hi there!", max_length=255)
    photo = models.ImageField(null=True, blank=True, default="default_img.svg")
    date_joined = models.DateTimeField(auto_now=True)

    @property
    def is_staff(self):
        return self.is_superuser

    objects = UserManager()

    USERNAME_FIELD = "email"

    class Meta:
        db_table = "users"

    def __str__(self):
        return self.email
