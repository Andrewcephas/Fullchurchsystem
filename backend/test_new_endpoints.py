#!/usr/bin/env python
"""
Test all newly implemented API endpoints using Django test client
"""
import os, sys, json
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'church_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import django; django.setup()

from django.test import Client
from django.contrib.auth.models import User

client = Client()

def login():
    print("=== 1. Login ===")
    resp = client.post('/api/auth/login/', data=json.dumps({'username':'superadmin','password':'test1234'}), content_type='application/json')
    data = resp.json()
    if resp.status_code == 200 and data.get('user'):
        print(f"   SUCCESS: {data['user']['username']}")
        # Get CSRF token from cookies
        csrf = client.cookies.get('csrftoken')
        return csrf.value if csrf else None
    else:
        print(f"   FAILED: {resp.status_code} {data}")
        return None

def api_get(path):
    resp = client.get(path)
    try:
        return resp.json(), None
    except:
        return None, f"Status {resp.status_code}"

def api_post(path, data, csrf):
    resp = client.post(path, data=json.dumps(data), content_type='application/json', HTTP_X_CSRFTOKEN=csrf)
    try:
        return resp.json(), None
    except:
        return None, f"Status {resp.status_code}"

def test_communications(csrf):
    print("\n=== 2. Communications ===")
    from api.models import Branch
    branch = Branch.objects.first()
    if not branch: print("   SKIP: No branch"); return
    res, err = api_post('/api/communications/', {'message':'Test from API','branch_id':str(branch.id)}, csrf)
    print(f"   CREATE: {'SUCCESS '+str(res.get('id')) if res else 'FAIL '+str(err)}")

def test_private_messages(csrf):
    print("\n=== 3. Private Messages ===")
    from api.models import UserRole
    role = UserRole.objects.filter(role='branch_admin').first()
    if not role: print("   SKIP: No branch admin"); return
    res, err = api_post('/api/private-messages/', {'receiver_id': str(role.user.id), 'message':'Test from API'}, csrf)
    if res:
        print(f"   SEND: SUCCESS - to {res.get('receiver_email')}, subject: {res.get('subject','')[:30]}")
    else:
        print(f"   SEND FAILED: {err}")

def test_site_settings(csrf):
    print("\n=== 4. Site Settings ===")
    res, err = api_get('/api/site-settings/')
    print(f"   LIST: {'SUCCESS' if res else 'FAIL: '+str(err)}")
    res, err = api_post('/api/site-settings/bulk_update/', {'site_name':'Updated GPC'}, csrf)
    print(f"   BULK UPDATE: {'SUCCESS' if res else 'FAIL '+str(err)}")

def test_sunday_school(csrf):
    print("\n=== 5. Sunday School ===")
    from api.models import Branch
    branch = Branch.objects.first()
    if not branch: print("   SKIP: No branch"); return
    res, err = api_post('/api/sunday-school/', {'class_name':'API Test Class','branch_id':str(branch.id)}, csrf)
    if not res: print(f"   CREATE CLASS FAILED: {err}"); return
    print(f"   CREATE CLASS: SUCCESS - {res['id']}")
    res, err = api_get(f"/api/sunday-school/members/?class_id={res['id']}")
    print(f"   LIST MEMBERS: {'SUCCESS' if res else 'FAIL: '+str(err)}")

def test_branch_filtering():
    print("\n=== 6. Branch Filtering ===")
    from api.models import UserRole, Member, Finance, Event, Sermon, Attendance, PrayerRequest, Notice
    u = User.objects.filter(email='branchadmin@gmail.com').first()
    if not u: print("   SKIP: Branch admin not found"); return
    role = UserRole.objects.get(user=u)
    br = role.branch
    print(f"   Branch Admin's branch: {br.branch_name}")
    for name, model in [('Member',Member),('Finance',Finance),('Event',Event),('Sermon',Sermon),('Attendance',Attendance),('PrayerRequest',PrayerRequest),('Notice',Notice)]:
        total = model.objects.count()
        visible = model.objects.filter(branch=br).count() if hasattr(model, 'branch') else total
        print(f"   {name}: {visible}/{total} visible")

if __name__ == '__main__':
    print("Testing New API Endpoints\n")
    csrf = login()
    if csrf:
        test_communications(csrf)
        test_private_messages(csrf)
        test_site_settings(csrf)
        test_sunday_school(csrf)
        test_branch_filtering()
        print("\n=== Tests Completed ===")
    else:
        print("Login failed")
