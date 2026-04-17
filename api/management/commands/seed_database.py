"""
Management command to seed database with initial data
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Branch, UserRole, Member, SiteSettings
import uuid


class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')

        # Create branches
        branches_data = [
            {
                'branch_name': 'Main Branch',
                'location': 'City Center',
                'pastor_name': 'Pastor Samuel',
                'church_email': 'main@church.local',
                'church_phone': '+1-555-0101'
            },
            {
                'branch_name': 'North Branch',
                'location': 'North District',
                'pastor_name': 'Pastor John',
                'church_email': 'north@church.local',
                'church_phone': '+1-555-0102'
            },
            {
                'branch_name': 'South Branch',
                'location': 'South District',
                'pastor_name': 'Pastor Mary',
                'church_email': 'south@church.local',
                'church_phone': '+1-555-0103'
            }
        ]

        branches = {}
        for branch_data in branches_data:
            branch, created = Branch.objects.get_or_create(
                branch_name=branch_data['branch_name'],
                defaults=branch_data
            )
            branches[branch_data['branch_name']] = branch
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created branch: {branch.branch_name}'))

        # Create admin users
        admin_users = []
        for i, (branch_name, branch) in enumerate(branches.items()):
            username = f'admin_{branch_name.lower().replace(" ", "_")}'
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'admin_{i+1}@church.local',
                    'first_name': f'Admin {i+1}',
                    'last_name': 'User',
                    'is_staff': True,
                    'is_superuser': i == 0  # First admin is super admin
                }
            )
            if created:
                user.set_password('admin123')  # Change in production!
                user.save()
                self.stdout.write(self.style.SUCCESS(f'✓ Created user: {user.username}'))
            
            # Create user role
            role_type = 'super_admin' if i == 0 else 'branch_admin'
            role, created = UserRole.objects.get_or_create(
                user=user,
                defaults={
                    'role': role_type,
                    'branch': branch
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created {role_type} role for {user.username}'))
            
            admin_users.append(user)

        # Create sample members
        sample_members = [
            {
                'name': 'John Doe',
                'email': 'john@example.com',
                'phone': '+1-555-1001',
                'gender': 'M',
                'address': '123 Main St',
                'department': 'Finance',
                'member_category': 'active',
                'branch': branches['Main Branch']
            },
            {
                'name': 'Jane Smith',
                'email': 'jane@example.com',
                'phone': '+1-555-1002',
                'gender': 'F',
                'address': '456 Oak Ave',
                'department': 'Ushers',
                'member_category': 'active',
                'branch': branches['Main Branch']
            },
            {
                'name': 'Michael Johnson',
                'email': 'michael@example.com',
                'phone': '+1-555-1003',
                'gender': 'M',
                'address': '789 Pine Rd',
                'department': 'Music',
                'member_category': 'active',
                'branch': branches['North Branch']
            }
        ]

        for member_data in sample_members:
            member, created = Member.objects.get_or_create(
                email=member_data['email'],
                defaults=member_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created member: {member.name}'))

        # Create site settings
        settings = [
            {
                'key': 'church_name',
                'value': {'name': 'Community Church of Faith'}
            },
            {
                'key': 'organization_email',
                'value': {'email': 'info@church.local'}
            },
            {
                'key': 'organization_phone',
                'value': {'phone': '+1-555-0100'}
            }
        ]

        for setting in settings:
            site_setting, created = SiteSettings.objects.get_or_create(
                key=setting['key'],
                defaults={'value': setting['value']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created setting: {setting["key"]}'))

        self.stdout.write(self.style.SUCCESS('\n✓ Database seeding completed successfully!'))
        self.stdout.write(self.style.WARNING('\nIMPORTANT: Change default passwords for admin users in production!'))
