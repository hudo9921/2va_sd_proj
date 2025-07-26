from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
import re

from .custom_fields.cpf_field import CPFField



class UserManager(BaseUserManager):
    def create_user(self, cpf=None, password=None, **kwargs):
        if not cpf:
            raise ValueError("Usuário precisa ter um CPF")
        if not password:
            raise ValueError("Usuário precisa ter uma senha")

        cpf = re.sub("[-.]", "", cpf)

        user_obj = self.model(cpf = cpf, active=True, **kwargs)
        user_obj.set_password(password)

        user_obj.save(using=self._db)
        return user_obj

    def create_superuser(self, cpf, password=None, **kwargs):
        user = self.create_user(cpf, password, admin=True, staff=True, **kwargs)
        return user


class User(AbstractBaseUser):
    cpf = CPFField('cpf', max_length=11, unique=True, primary_key=True)
    email = models.EmailField(max_length=255, null=True)
    full_name = models.CharField(max_length=100, null=True)
    address = models.CharField(max_length=150, null=True)
    
    active = models.BooleanField(default=True)
    admin = models.BooleanField(default=False)
    staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELD = []

    objects = UserManager()

    def str(self):
        return f"{self.full_name} ({self.cpf})"

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_admin(self):
        return self.admin

    @property
    def is_active(self):
        return self.active

    @property
    def is_staff(self):
        return self.staff

    class Meta:
        verbose_name = 'User'