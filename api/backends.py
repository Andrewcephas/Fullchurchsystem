"""
Custom authentication backend — allows login with email (Gmail) as username.
Password is the member's phone number as set during role assignment.
"""
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User


class EmailOrUsernameBackend(ModelBackend):
    """
    Authenticate using email OR username.
    When super admin assigns a member as secretary/pastor, the account
    is created with username=email so they log in with their Gmail address.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None

        # Try email first
        try:
            user = User.objects.get(email__iexact=username)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            pass
        except User.MultipleObjectsReturned:
            # If multiple users share the email, fall through to username
            pass

        # Fall back to username
        try:
            user = User.objects.get(username=username)
            if user.check_password(password) and self.user_can_authenticate(user):
                return user
        except User.DoesNotExist:
            pass

        return None
