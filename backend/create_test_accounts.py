"""
Create dummy test accounts for development
"""
import os
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.contrib.auth.models import User
from api.models import UserRole, Branch

def create_test_accounts():
    """Create dummy accounts for testing"""

    # Super Admin
    superadmin_email = 'superadmin@gmail.com'
    if User.objects.filter(email=superadmin_email).exists():
        print(f"[OK] Super admin already exists: {superadmin_email}")
    else:
        user = User.objects.create_user(
            username='superadmin',
            email=superadmin_email,
            password='test1234',
            first_name='Super',
            last_name='Admin',
            is_staff=True,
            is_superuser=True
        )
        UserRole.objects.create(user=user, role='super_admin', branch=None)
        print(f"[OK] Created super admin: {superadmin_email} (password: test1234)")

    # Branch Admin
    branch_admin_email = 'branchadmin@gmail.com'
    if User.objects.filter(email=branch_admin_email).exists():
        print(f"[OK] Branch admin already exists: {branch_admin_email}")
    else:
        branch, _ = Branch.objects.get_or_create(
            branch_name='Main Branch',
            defaults={
                'location': '123 Church Street',
                'address': '123 Church Street, City, State 12345',
                'church_email': 'main@globalpowerchurch.org',
                'church_phone': '555-0100'
            }
        )
        user = User.objects.create_user(
            username='branchadmin',
            email=branch_admin_email,
            password='test1234',
            first_name='Branch',
            last_name='Admin',
            is_staff=True
        )
        UserRole.objects.create(user=user, role='branch_admin', branch=branch)
        print(f"[OK] Created branch admin: {branch_admin_email} (password: test1234)")

    # Regular Member
    member_email = 'member@gmail.com'
    if User.objects.filter(email=member_email).exists():
        print(f"[OK] Member already exists: {member_email}")
    else:
        branch, _ = Branch.objects.get_or_create(
            branch_name='Main Branch',
            defaults={
                'location': '123 Church Street',
                'address': '123 Church Street, City, State 12345',
                'church_email': 'main@globalpowerchurch.org',
                'church_phone': '555-0100'
            }
        )
        user = User.objects.create_user(
            username='member',
            email=member_email,
            password='test1234',
            first_name='John',
            last_name='Member'
        )
        UserRole.objects.create(user=user, role='member', branch=branch)
        print(f"[OK] Created member: {member_email} (password: test1234)")

    print("\nAll test accounts created successfully!")

if __name__ == '__main__':
    create_test_accounts()
