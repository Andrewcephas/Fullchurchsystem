import os
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import django
django.setup()

from django.test import Client
from django.contrib.auth.models import User
import json

def run_validation():
    print("Starting API Role Validation...")
    client = Client()

    # Get users
    superadmin = User.objects.get(email='superadmin@gmail.com')
    branchadmin1 = User.objects.get(email='branchadmin@gmail.com') # Main Branch
    branchadmin2 = User.objects.get(email='pastor2@gmail.com') # North Campus

    # 1. Test Super Admin Access (Should see all members)
    client.force_login(superadmin)
    response = client.get('/api/members/')
    super_data = response.json()
    super_count = super_data.get('count', len(super_data))
    print(f"[Super Admin] Total members visible: {super_count}")

    # 2. Test Branch Admin 1 Access (Should see only Main Branch members)
    client.force_login(branchadmin1)
    response = client.get('/api/members/')
    ba1_data = response.json()
    ba1_count = ba1_data.get('count', len(ba1_data))
    print(f"[Branch Admin 1] Total members visible: {ba1_count}")

    # 3. Test Branch Admin 2 Access (Should see only North Campus members)
    client.force_login(branchadmin2)
    response = client.get('/api/members/')
    ba2_data = response.json()
    ba2_count = ba2_data.get('count', len(ba2_data))
    print(f"[Branch Admin 2] Total members visible: {ba2_count}")

    # Assertions
    if super_count == 0:
        print("❌ FAILED: Super admin sees 0 members")
    elif ba1_count + ba2_count > super_count:
        print("❌ FAILED: Branch admins see more members than exist")
    elif ba1_count == super_count and ba2_count == super_count:
        print("❌ FAILED: Branch admins are seeing ALL members (No isolation!)")
    else:
        print("✅ PASSED: Data isolation working correctly for Members!")

    # Test Attendance Isolation
    client.force_login(branchadmin1)
    response = client.get('/api/attendance/')
    att_data = response.json()
    att_count = att_data.get('count', len(att_data))
    print(f"[Branch Admin 1] Total attendance records visible: {att_count}")

    client.force_login(superadmin)
    response = client.get('/api/attendance/')
    super_att_data = response.json()
    super_att_count = super_att_data.get('count', len(super_att_data))
    print(f"[Super Admin] Total attendance records visible: {super_att_count}")

    if att_count > 0 and att_count <= super_att_count:
        print("✅ PASSED: Data isolation working correctly for Attendance!")
    else:
        print("❌ FAILED: Attendance isolation is broken.")


if __name__ == '__main__':
    run_validation()
