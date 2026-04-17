# Church Management System - Complete Setup Guide

## System Overview

This is a full-stack church management system with:
- **Backend**: Django REST API (port 8000)
- **Frontend**: React + Vite + TypeScript + Shadcn/UI (port 5173 or 5174)
- **Database**: SQLite (default) with 30+ Bible quotes and comprehensive dummy data

---

## Quick Start

### 1. Start Django Backend

```bash
cd "C:\coding in progress\church-website"
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

Backend will run at `http://localhost:8000/api/`

### 2. Start Frontend Development Server

Open a new terminal:

```bash
cd "C:\coding in progress\church-website"
npm run dev
```

Frontend will run at `http://localhost:5173/` or next available port.

### 3. Access the Application

Open browser to `http://localhost:5173/`

Login Page: `http://localhost:5173/login`

Admin Dashboard: `http://localhost:5173/admin`

---

## Login Credentials

| Role | Username | Email | Password | Access |
|------|----------|-------|----------|--------|
| Super Admin | `superadmin` | `superadmin@gmail.com` | `test1234` | Full system access |
| Branch Admin | `branchadmin` | `branchadmin@gmail.com` | `test1234` | One branch access |
| Branch Admin | `pastor2` | `pastor2@gmail.com` | `test1234` | North Campus |
| Member | `member` | `member@gmail.com` | `test1234` | Limited access |

---

## Super Admin Features

As **Super Admin**, you can:

1. **Manage Branches**: Create/edit church branches
2. **Create Branch Admins**: Assign admins to specific branches
3. **View Analytics**: System-wide statistics
4. **Manage All Data**: Full CRUD across all models
5. **Generate Social Quotes**: Create/share branded Bible quotes
6. **Access All Admin Pages**: 21 admin modules fully migrated to Django API

---

## Admin Pages (21 Total)

All admin pages now use Django API (no Supabase):

- `/admin/dashboard` - Main dashboard with analytics
- `/admin/settings` - Site settings
- `/admin/branches` - Branch management
- `/admin/members` - Member profiles
- `/admin/user-roles` - Role assignments
- `/admin/sunday-school` - Class management
- `/admin/attendance` - Service attendance
- `/admin/events` - Church events
- `/admin/sermons` - Sermon library
- `/admin/notices` - Announcements
- `/admin/finance` - Contributions & budget
- `/admin/prayer-requests` - Prayer management
- `/admin/communications` - Messages & emails
- `/admin/member-transfers` - Transfer requests
- `/admin/notification-preferences` - Notification settings
- `/admin/backup-security` - Backup logs
- `/admin/analytics` - Statistics & reports
- `/admin/social-quotes` - Social media quote generator
- `/admin/messages` - Private messaging
- `/admin/member-profiles` - Detailed member view

---

## API Endpoints

All endpoints under `/api/`

### Authentication
- `POST /api/auth/login/` - Login (CSRF exempt)
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/user/` - Get current user

### Social Quotes
- `GET /api/social-quotes/` - List quotes
- `GET /api/social-quotes/themes/` - Available themes
- `POST /api/social-quotes/generate/` - Generate random quote for theme
- `POST /api/social-quotes/{id}/` - Create new quote (admin only)

### Other Key Endpoints
- `GET /api/branches/` - Branch list
- `GET /api/members/` - Members (filter by branch)
- `GET /api/attendance/` - Attendance records
- `GET /api/finance/` - Financial data
- `GET /api/events/` - Events calendar
- etc. (16 ViewSets total)

---

## Social Quote Generator

The **SocialQuotes** admin page (`/admin/social-quotes`) allows:

1. Select a theme (Faith, Prayer, Love, Hope, Worship, Grace, Strength, Healing, Salvation, Peace)
2. Generate a random Bible verse for that theme
3. Copy the quote text
4. Download as **1080×1080 PNG** with:
   - Nature-themed green gradient background
   - Gold decorative border
   - Church logo watermark (semi-transparent)
   - "— Global Power Church" attribution

---

## Database Schema

### Core Models
- **User** (Django built-in) - Authentication
- **UserRole** - Role + branch assignment
- **Branch** - Church locations
- **Member** - Member profiles
- **SundaySchool** - Classes
- **Attendance** - Service counts
- **Finance** - Contributions
- **Event** - Church events
- **Sermon** - Sermon library
- **Notice** - Announcements
- **PrayerRequest** - Prayer management
- **Communication** - Messages
- **MemberTransfer** - Transfer requests
- **SocialQuote** - Social media quotes
- **SiteSettings** - Key-value site config

### Relationships
```
User (1) → (1) UserRole → (0..1) Branch
User (1) → (0..*) Member (email field)
Branch (1) → (*) Member
Branch (1) → (*) Attendance
Branch (1) → (*) Finance
Branch (1) → (*) Event
Branch (1) → (*) Sermon
Branch (1) → (*) Notice
Branch (1) → (*) PrayerRequest
Branch (1) → (*) Communication
Branch (1) → (*) SundaySchool
Branch (1) → (*) MemberTransfer (as from_branch/to_branch)
```

---

## CORS Configuration

Django CORS is configured for frontend dev servers:
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (alternative)
- `http://localhost:8081` (alternative)

If your frontend runs on a different port, add it to `CORS_ALLOWED_ORIGINS` in `church_backend/settings.py` and restart Django.

---

## CSRF Protection

- Login (`/auth/login/`) and logout (`/auth/logout/`) are CSRF-exempt
- All other POST/PUT/DELETE requests require CSRF token
- Frontend automatically reads `csrftoken` cookie and sends `X-CSRFToken` header

---

## Troubleshooting

### 404 on Django root
Django root URL `/` has no view. Use:
- Admin panel: `http://localhost:8000/admin/`
- API root: `http://localhost:8000/api/`
- Frontend: `http://localhost:5173/`

### Login fails
1. Ensure Django is running on port 8000
2. Ensure frontend is running and CORS includes your frontend port
3. Use username `superadmin` (not email) with password `test1234`
4. Check browser console for CORS errors

### CORS error
1. Stop Django server
2. Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `church_backend/settings.py`
3. Restart Django

### Port already in use
Kill existing processes:
```bash
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

Then restart servers.

---

## Test API Directly

### Test login via curl:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"superadmin","password":"test1234"}'
```

Expected: `{"user": {...}, "message": "Login successful"}`

### Test CORS headers:
```bash
curl -I -X OPTIONS http://localhost:8000/api/auth/login/ \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
```

Should include `Access-Control-Allow-Origin: http://localhost:5173`

---

## Data Reset

To reset to clean state:

```bash
# Drop database
del db.sqlite3

# Reapply migrations
cd "C:\coding in progress\church-website"
.\venv\Scripts\python.exe manage.py migrate

# Recreate test accounts
.\venv\Scripts\python.exe create_test_accounts.py

# Populate full dummy data
.\venv\Scripts\python.exe populate_full_dummy_data.py
```

---

## Next Steps for Development

### Add new branch admin accounts
1. Login as super admin
2. Go to `/admin/user-roles` page (Django admin or app page)
3. Create new UserRole with role='branch_admin' and select branch

### Add more members
Submit member creation form from admin panel.

### Configure real authentication
- Switch from session auth to JWT tokens if needed
- Update frontend auth context to store tokens

### Production deployment
- Set DEBUG = False
- Use PostgreSQL/MySQL instead of SQLite
- Configure proper static file serving
- Set up AWS S3 or Cloudinary for media files
- Use environment variables for secrets

---

## Project Structure

```
church-website/
├── manage.py                  # Django entry point
├── church_backend/
│   ├── settings.py           # Django settings (CORS, AUTH, etc.)
│   ├── urls.py               # Root URL routing
│   └── wsgi.py
├── api/
│   ├── models.py             # All Django models (564 lines)
│   ├── serializers.py        # DRF serializers
│   ├── views.py              # ViewSets + Custom actions (686 lines)
│   ├── urls.py               # API routing
│   ├── admin.py              # Django admin config
│   └── apps.py
├── src/
│   ├── services/api.ts       # Frontend HTTP client (526 lines)
│   ├── contexts/AuthContext.tsx  # Auth state management
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── admin/            # 21 admin pages
│   │       ├── Dashboard.tsx
│   │       ├── SocialQuotes.tsx
│   │       ├── Settings.tsx
│   │       └── ...
│   └── components/ui/        # Shadcn/UI components
├── populate_quotes.py         # Script: 30 Bible quotes
├── create_test_accounts.py   # Script: 3 test accounts
├── populate_full_dummy_data.py  # Script: Complete dummy dataset
└── dist/                     # Production build output
```

---

## File Modifications Summary

### Backend (Django)
| File | Changes |
|------|---------|
| `api/models.py` | Added `SocialQuote` model (528-551) |
| `api/serializers.py` | Added `SocialQuoteSerializer`, enhanced `UserSerializer` |
| `api/views.py` | Added `SocialQuoteViewSet` (500-559), enhanced LoginView |
| `api/urls.py` | Registered `social-quotes` router |
| `church_backend/settings.py` | Added CORS for ports 8080, 8081 |
| `db.sqlite3` | Seeded with 30 quotes + full dummy data |

### Frontend (React)
| File | Changes |
|------|---------|
| `src/services/api.ts` | Added all API methods, CSRF token support |
| `src/contexts/AuthContext.tsx` | Fixed login response handling |
| `src/pages/Login.tsx` | Login form |
| `src/pages/admin/SocialQuotes.tsx` | Enhanced branding (nature bg, watermark) |
| All 21 admin pages | Replaced supabase with `apiService` |

---

## Support

If login fails with CORS:
1. Verify Django is running: `http://localhost:8000/api/auth/user/` returns 401 (unauthenticated)
2. Verify CORS headers present in preflight OPTIONS response
3. Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`

If credentials don't work:
```bash
cd "C:\coding in progress\church-website"
.\venv\Scripts\python.exe manage.py changepassword superadmin
```

---

**System Status:** ✅ Fully configured with dummy data, ready for testing and development.
