import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Branch, UserRole

def setup_test_data():
    # Create Branches
    b_a, _ = Branch.objects.get_or_create(branch_name='Branch A', defaults={'location': 'Nairobi'})
    b_b, _ = Branch.objects.get_or_create(branch_name='Branch B', defaults={'location': 'Mombasa'})

    def create_user(username, role, branch=None):
        u, _ = User.objects.get_or_create(username=username, defaults={'email': f'{username}@example.com', 'is_staff': True, 'is_active': True})
        u.set_password('password')
        u.save()
        UserRole.objects.update_or_create(user=u, defaults={'role': role, 'branch': branch})
        return u

    create_user('bishop', 'super_admin')
    create_user('pastor_a', 'branch_admin', b_a)
    create_user('sec_a', 'secretary', b_a)
    create_user('teacher_a', 'sunday_school_teacher', b_a)
    create_user('pastor_b', 'branch_admin', b_b)
    print('Test data created successfully')

if __name__ == "__main__":
    setup_test_data()
