"""
Complete System Setup Script
Sets up Django backend with full dummy data for testing
"""

import os
import sys
import subprocess
import threading
import time

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.contrib.auth.models import User, Permission
from api.models import UserRole, Branch, Member, SundaySchool, Attendance, Event, Sermon, Notice, Finance, PrayerRequest, Communication, SocialQuote, SiteSettings

def create_dummy_data():
    """Create comprehensive dummy data for analytics and testing"""
    
    print("="*60)
    print("CHURCH MANAGEMENT SYSTEM - DUMMY DATA GENERATOR")
    print("="*60)
    
    # Ensure Main Branch exists
    branch, _ = Branch.objects.get_or_create(
        branch_name='Main Branch',
        defaults={
            'location': '123 Church Street, Downtown',
            'address': '123 Church Street, Cityville, ST 12345',
            'church_email': 'main@globalpowerchurch.org',
            'church_phone': '+1-555-0100'
        }
    )
    print(f"[OK] Branch: {branch.branch_name}")
    
    # Create another branch
    branch2, _ = Branch.objects.get_or_create(
        branch_name='North Campus',
        defaults={
            'location': '456 Worship Ave',
            'address': '456 Worship Ave, Northville, ST 12345',
            'church_email': 'north@globalpowerchurch.org',
            'church_phone': '+1-555-0101'
        }
    )
    print(f"[OK] Branch: {branch2.branch_name}")
    
    # SUPER ADMIN (already exists) - verify
    superadmin_user = User.objects.filter(email='superadmin@gmail.com').first()
    if superadmin_user:
        UserRole.objects.get_or_create(user=superadmin_user, defaults={'role': 'super_admin', 'branch': None})
        print(f"[OK] Super Admin: {superadmin_user.email}")
    else:
        print("[ERR] Super admin not found! Run create_test_accounts.py first")
        return
    
    # Branch Admin 1 (Main Branch)
    branch_admin1 = User.objects.filter(email='branchadmin@gmail.com').first()
    if not branch_admin1:
        branch_admin1 = User.objects.create_user(
            username='branchadmin',
            email='branchadmin@gmail.com',
            password='test1234',
            first_name='Pastor',
            last_name='Johnson',
            is_staff=True
        )
        UserRole.objects.create(user=branch_admin1, role='branch_admin', branch=branch)
        print(f"[OK] Branch Admin (Main): {branch_admin1.email}")
    else:
        print(f"[OK] Branch Admin exists: {branch_admin1.email}")
    
    # Branch Admin 2 (North Campus)
    branch_admin2 = User.objects.filter(email='pastor2@gmail.com').first()
    if not branch_admin2:
        branch_admin2 = User.objects.create_user(
            username='pastor2',
            email='pastor2@gmail.com',
            password='test1234',
            first_name='Pastor',
            last_name='Smith',
            is_staff=True
        )
        UserRole.objects.create(user=branch_admin2, role='branch_admin', branch=branch2)
        print(f"[OK] Branch Admin (North): {branch_admin2.email}")
    else:
        print(f"[OK] Branch Admin exists: {branch_admin2.email}")
    
    # Create Members
    # Create Members (simplified - just create Member records)
    members_data = [
        ('John Member', 'john.member@gmail.com', 'Adult'),
        ('Jane Member', 'jane.member@gmail.com', 'Adult'),
        ('Bob Wilson', 'bob.wilson@gmail.com', 'Youth'),
        ('Alice Jones', 'alice.jones@gmail.com', 'Youth'),
        ('Charlie Brown', 'charlie.brown@gmail.com', 'Adult'),
        ('Diana Prince', 'diana.prince@gmail.com', 'Adult'),
        ('Edward Carter', 'edward.carter@gmail.com', 'Sunday School'),
        ('Fiona Gallagher', 'fiona.gallagher@gmail.com', 'Adult'),
    ]
    
    created_members = []
    for name, email, category in members_data:
        member, created = Member.objects.get_or_create(
            email=email,
            defaults={
                'name': name,
                'phone': f'+1-555-{str(hash(email))[-4:]}',
                'gender': 'Male' if 'Bob' in name or 'John' in name or 'Charlie' in name or 'Edward' in name else 'Female',
                'member_category': category,
                'branch': branch,
                'join_date': '2024-01-15',
                'address': f'{hash(email) % 1000} Church Street',
                'membership_status': 'active'
            }
        )
        created_members.append(member)
        print(f"[OK] Member: {name} ({category})")
    
    # Sunday School Classes
    classes_data = [
        ('Beginners', branch),
        ('Primary', branch),
        ('Junior', branch),
        ('Youth Group', branch),
    ]
    
    created_classes = []
    for name, br in classes_data:
        ss_class, _ = SundaySchool.objects.get_or_create(
            class_name=name,
            branch=br
        )
        created_classes.append(ss_class)
        print(f"[OK] Sunday School Class: {name}")
    
    # Add members to classes - skipped (Sunday School uses member_count field, not M2M)
    # Just update member_count for testing
    for ss_class in created_classes:
        ss_class.member_count = 12
        ss_class.save(update_fields=['member_count'])
        print(f"[OK] {ss_class.class_name}: {ss_class.member_count} members")
    
    # Attendance Records (last 4 weeks)
    from datetime import date, timedelta
    today = date.today()
    for week in range(4):
        service_date = today - timedelta(days=today.weekday() + 7*week)
        attendance, _ = Attendance.objects.get_or_create(
            branch=branch,
            service_date=service_date,
            service_type='sunday',
            defaults={'count': 45 + (week*5), 'online_count': 10}
        )
        print(f"[OK] Attendance: {attendance.service_date} - {attendance.count} members")
    
    # Events
    # Events
    events_data = [
        ('Sunday Service', 'Weekly worship service', today + timedelta(days=1)),
        ('Bible Study', 'Midweek Bible study', today + timedelta(days=3)),
        ('Youth Night', 'Youth fellowship', today + timedelta(days=10)),
        ('Prayer Meeting', 'Corporate prayer', today + timedelta(days=2)),
    ]
    for title, desc, start in events_data:
        Event.objects.get_or_create(
            title=title,
            branch=branch,
            defaults={'description': desc, 'event_date': start, 'location': 'Main Sanctuary'}
        )
    print(f"[OK] Events created: {len(events_data)}")
    
    # Sermons
    sermons_data = [
        ('The Power of Faith', 'Hebrews 11:1 - Faith is the substance of things hoped for', 'Pastor Michael', today - timedelta(days=6)),
        ('Walking in Love', '1 Corinthians 13 - Love never fails', 'Pastor Michael', today - timedelta(days=13)),
        ('Hope in Christ', 'Romans 15:13 - The God of hope', 'Pastor Sarah', today - timedelta(days=20)),
    ]
    for title, desc, speaker, date_val in sermons_data:
        Sermon.objects.get_or_create(
            title=title,
            branch=branch,
            defaults={'description': desc, 'speaker': speaker, 'sermon_date': date_val}
        )
    print(f"[OK] Sermons created: {len(sermons_data)}")
    
    # Notices
    notices_data = [
        ('Annual Church Conference', 'Mark your calendars for our annual conference', 'important'),
        ('Sunday School Teacher Training', 'Training session this Saturday', 'info'),
        ('Youth Camp Registration', 'Early bird registration ends soon', 'event'),
    ]
    for title, content, n_type in notices_data:
        Notice.objects.get_or_create(
            title=title,
            branch=branch,
            defaults={'content': content, 'is_global': n_type == 'important'}
        )
    print(f"[OK] Notices created: {len(notices_data)}")
    
    # Finance - dummy data for analytics (individual contributions)
    finance_data = [
        ('Tithes - April Week 1', 'tithe', 3000.00, today - timedelta(days=13)),
        ('Tithes - April Week 2', 'tithe', 3200.00, today - timedelta(days=6)),
        ('Tithes - April Week 3', 'tithe', 3100.00, today - timedelta(days=1)),
        ('Tithes - April Week 4', 'tithe', 3200.00, today + timedelta(days=6)),
        ('Offering - April Week 1', 'offering', 1200.00, today - timedelta(days=13)),
        ('Offering - April Week 2', 'offering', 1100.00, today - timedelta(days=6)),
        ('Offering - April Week 3', 'offering', 1300.00, today - timedelta(days=1)),
        ('Offering - April Week 4', 'offering', 1400.00, today + timedelta(days=6)),
        ('Building Fund - April', 'project_fund', 2000.00, today - timedelta(days=5)),
        ('Missions - April', 'donation', 1500.00, today - timedelta(days=10)),
        
        ('March Tithes Total', 'tithe', 14500.00, today - timedelta(days=45)),
        ('March Offerings Total', 'offering', 4800.00, today - timedelta(days=46)),
    ]
    for desc, category, amount, date_val in finance_data:
        Finance.objects.get_or_create(
            branch=branch,
            category=category,
            date=date_val,
            defaults={
                'amount': amount,
                'payment_method': 'cash',
                'giver': 'Congregation',
                'is_anonymous': False,
                'approval_status': 'approved',
                'notes': desc
            }
        )
    print(f"[OK] Finance records: {len(finance_data)}")
    
    # Prayer Requests - use first member
    if created_members:
        PrayerRequest.objects.get_or_create(
            name=created_members[0].name,
            email=created_members[0].email,
            branch=branch,
            defaults={'request': 'Healing for my mother', 'status': 'new'}
        )
        PrayerRequest.objects.get_or_create(
            name=created_members[1].name,
            email=created_members[1].email,
            branch=branch,
            defaults={'request': 'Guidance for job decision', 'status': 'processed'}
        )
        PrayerRequest.objects.get_or_create(
            name=created_members[2].name,
            email=created_members[2].email,
            branch=branch,
            defaults={'request': 'Family restoration', 'status': 'new'}
        )
        PrayerRequest.objects.get_or_create(
            name=created_members[3].name,
            email=created_members[3].email,
            branch=branch,
            defaults={'request': 'Thanksgiving for safe travel', 'status': 'answered'}
        )
    print(f"[OK] Prayer requests created: 4")
    
    # Communications
    comms_data = [
        ('Welcome to GPC!', 'Hello and welcome to our church family. We are glad to have you!'),
        ('Volunteer Opportunities', 'Sign up to serve this month. Contact the church office.'),
    ]
    for title, msg in comms_data:
        Communication.objects.get_or_create(
            title=title,
            branch=branch,
            defaults={'message': msg}
        )
    print(f"[OK] Communications: {len(comms_data)}")
    
    # Site Settings (key-value store)
    site_config = {
        'site_name': 'Global Power Church',
        'church_email': 'info@globalpowerchurch.org',
        'church_phone': '+1-555-0100',
        'address': '123 Church Street, Cityville, ST 12345',
        'facebook_url': 'https://facebook.com/globalpowerchurch',
        'instagram_url': 'https://instagram.com/globalpowerchurch',
        'youtube_url': 'https://youtube.com/globalpowerchurch',
        'primary_color': '#6b21a8',
        'secondary_color': '#d4a843',
    }
    for key, value in site_config.items():
        SiteSettings.objects.get_or_create(
            key=key,
            defaults={'value': value}
        )
    print("[OK] Site settings configured")
    
    # Summary
    print("\n" + "="*60)
    print("DUMMY DATA SUMMARY")
    print("="*60)
    print(f"Branches: {Branch.objects.count()}")
    print(f"SuperUsers: {User.objects.filter(is_superuser=True).count()}")
    print(f"Staff Users: {User.objects.filter(is_staff=True).count()}")
    print(f"Members: {Member.objects.count()}")
    print(f"Sunday School Classes: {SundaySchool.objects.count()}")
    print(f"Attendance Records: {Attendance.objects.count()}")
    print(f"Events: {Event.objects.count()}")
    print(f"Sermons: {Sermon.objects.count()}")
    print(f"Notices: {Notice.objects.count()}")
    print(f"Finance Records: {Finance.objects.count()}")
    print(f"Prayer Requests: {PrayerRequest.objects.count()}")
    print(f"Communications: {Communication.objects.count()}")
    print(f"Social Quotes: {SocialQuote.objects.count()}")
    print("\n[SUCCESS] System is fully configured with dummy data!")
    print("\nLogin credentials:")
    print("  Super Admin: superadmin@gmail.com / test1234")
    print("  Branch Admin: branchadmin@gmail.com / test1234")
    print("  Member: member@gmail.com / test1234")

if __name__ == '__main__':
    create_dummy_data()
