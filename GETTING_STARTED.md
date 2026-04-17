# Church Website - Getting Started Guide

Welcome! This document will guide you through setting up and running the Church Management System.

## 📋 System Overview

You now have a **complete church management system** with:

- **Frontend**: React application with 20+ pages and components
- **Backend**: Django REST API with 14+ endpoints
- **Database**: MySQL with 18 data models
- **Features**: Member management, finances, attendance, events, sermons, notifications, analytics, and more

### Architecture
```
[React Frontend]              [Django Backend]              [MySQL Database]
  Port 5173         →          Port 8000         →         Port 3306
  http://localhost:5173        http://localhost:8000/api   localhost
```

---

## 🚀 Quick Start (30 minutes)

### Step 1: Install Prerequisites (5 min)
Verify you have these installed:
- **Python 3.10+**: [Download here](https://www.python.org/)
- **Node.js 16+**: [Download here](https://nodejs.org/)
- **MySQL 8.0+**: [Download here](https://dev.mysql.com/downloads/mysql/)

```bash
python --version
node --version
mysql --version
```

### Step 2: Run Setup Script (10 min)
Double-click `setup.bat` in the project folder, then select:
1. **Option 1**: First-time setup
2. **Option 6**: Database setup (follow instructions)
3. **Option 7**: Run migrations
4. **Option 8**: Seed database

### Step 3: Start Servers (5 min)
Open TWO terminal windows:

**Window 1** (Django Backend):
```bash
venv\Scripts\activate
python manage.py runserver
```

**Window 2** (React Frontend):
```bash
npm run dev
```

### Step 4: Test It Works (5 min)
Open your browser:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api/`
- Admin: `http://localhost:8000/admin/`

---

## 📁 What You Have

### Created Files (This Session)

**Backend Core**
- `church_backend/settings.py` - Django configuration
- `church_backend/urls.py` - URL routing
- `church_backend/wsgi.py` - Server entry point
- `manage.py` - Django command interface

**API Layer**
- `api/models.py` - 18 database models
- `api/serializers.py` - API data formatting
- `api/views.py` - Business logic & endpoints
- `api/urls.py` - API routes
- `api/admin.py` - Admin interface

**Frontend Service**
- `src/services/api.ts` - Django API client for React

**Setup & Config**
- `requirements.txt` - Python packages
- `.env.example` - Configuration template
- `setup.bat` - Automated setup script

**Documentation**
- `README.md` - Project overview
- `DJANGO_SETUP_GUIDE.md` - Detailed setup instructions
- `MIGRATION_GUIDE.md` - React to Django migration guide
- `IMPLEMENTATION_CHECKLIST.md` - What's done and what's next

### Existing React Components
- Admin pages (8 new features)
- Member profiles, transfers, finance, notifications, analytics, security
- Navigation, layouts, UI components
- Hooks for data fetching

---

## 🔧 Detailed Setup Instructions

### Option A: Using setup.bat (Recommended for Windows)

```bash
# Run the script
setup.bat

# Menu options:
# 1 = Install everything (venv, dependencies)
# 6 = Create MySQL database
# 7 = Run Django migrations
# 8 = Seed sample data
# 3 = Start Django server
# 4 = Start React server
```

### Option B: Manual Setup

#### Create Virtual Environment
```bash
cd c:\coding in progress\church-website
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
```

#### Install Dependencies
```bash
pip install -r requirements.txt
npm install
```

#### Setup MySQL Database
```bash
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE church_db CHARACTER SET utf8mb4;
CREATE USER 'church_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON church_db.* TO 'church_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Configure Django
1. Copy `.env.example` to `.env`
2. Update database credentials:
   ```env
   DB_NAME=church_db
   DB_USER=church_user
   DB_PASSWORD=your_password  # Same as above
   DB_HOST=localhost
   DB_PORT=3306
   ```

#### Run Migrations
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_database
```

#### Start Development Servers
```bash
# Terminal 1
python manage.py runserver

# Terminal 2
npm run dev
```

---

## 🧪 Test Everything Works

### 1. Frontend
Open `http://localhost:5173` in browser
- Should see church website homepage
- Click "Admin" to access admin dashboard (if not logged in, you'll be redirected)

### 2. Django Admin
Open `http://localhost:8000/admin` in browser
- Login with superuser credentials you created
- Should see all 18 models available
- Can view/edit data directly

### 3. API Endpoints
Test API using curl or Postman:

```bash
# Get all branches
curl http://localhost:8000/api/branches/

# Get members
curl http://localhost:8000/api/members/

# Get financial summary
curl http://localhost:8000/api/finance/summary/
```

### 4. API Documentation
Visit `http://localhost:8000/api/` - DRF provides browsable API documentation

---

## 🔄 Next: Integrate React with Django

**Current Status**: React components exist but still use Supabase
**Next Step**: Update React to use Django API

### Phase 1: Authentication (1-2 hours)
Create login page that authenticates with Django:
```typescript
// src/components/Login.tsx
async function handleLogin(email, password) {
  const response = await fetch('http://localhost:8000/api-auth/login/', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ username: email, password })
  });
}
```

### Phase 2: Update Components (2-4 hours)
Replace Supabase calls with Django API:

**Before**:
```typescript
const { data } = await supabase.from('members').select('*');
```

**After**:
```typescript
const { data } = await apiService.getMembers();
```

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed examples.

### Phase 3: Test Everything (1-2 hours)
- Login and view member lists
- Create/edit/delete members
- Test all admin features
- Test financial reports

---

## 📊 System Architecture

### Frontend (React/TypeScript)
```
App.tsx (routes)
├── Pages (member, finance, events, etc.)
├── Components (UI, admin pages)
├── Hooks (data fetching, state)
└── Services
    └── api.ts (communicates with Django)
```

### Backend (Django/REST)
```
Django Server (port 8000)
├── Admin Interface (/admin/)
├── API Endpoints (/api/)
│   ├── /members/
│   ├── /finance/
│   ├── /attendance/
│   ├── /events/
│   └── ... 14 more endpoints
└── Database (MySQL)
    ├── 18 models/tables
    ├── Relationships
    └── Indexes
```

### Database (MySQL)
```
church_db
├── branches (locations)
├── members (profiles + extended fields)
├── user_roles (permissions)
├── attendance (service tracking)
├── finance (income/offerings)
├── events (church events)
├── sermons (sermon records)
├── notices (announcements)
├── prayer_requests
├── member_transfers
├── notifications (user preferences + sent logs)
└── ... 8 more tables
```

---

## 🔐 User Roles & Permissions

### Super Admin
- Full system access
- Manage all branches and users
- View all data
- Approve finances/transfers
- Create backups

### Branch Admin
- Manage branch data
- View branch members
- Approve transfers
- Create events

### Secretary
- View members
- Record attendance
- Process finances
- Create notices

### Sunday School Teacher
- Manage Sunday school class
- Track attendance

### Regular Member
- View own profile
- Submit prayer requests
- See notices
- View events

---

## 📚 Documentation Map

| Document | Purpose | Read When |
|----------|---------|-----------|
| [README.md](./README.md) | Project overview | First time |
| [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) | Detailed setup + troubleshooting | Setting up |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | How to update React components | Integrating frontend |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | What's done, what's left | Progress tracking |

---

## ⚙️ Configuration Files

### Key Configuration
- `church_backend/settings.py` - Django config
- `.env` - Database & API secrets
- `vite.config.ts` - Frontend build config
- `package.json` - Frontend dependencies
- `requirements.txt` - Backend dependencies

### Important Settings
```python
# settings.py
DATABASES['default']['NAME'] = 'church_db'  # Database name
CORS_ALLOWED_ORIGINS = ['http://localhost:5173']  # React URL
REST_FRAMEWORK['PAGE_SIZE'] = 50  # Results per page
```

---

## 🐛 Troubleshooting

### Django won't start
```bash
# Check migrations
python manage.py showmigrations

# Check Python/dependencies
python --version
pip list | grep Django
```

### React won't start
```bash
# Delete node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### API returns 404
- Ensure Django server is running on port 8000
- Check endpoint URL is correct
- Verify data exists in database

### Database connection error
- Verify MySQL is running
- Check credentials in `.env`
- Verify `church_db` exists: `mysql -u root -p -e "SHOW DATABASES;"`

See [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) for more help.

---

## 📈 Performance Tips

### Frontend
- Use React Query for automatic caching
- Lazy load heavy components
- Optimize images
- Minify CSS/JS in production

### Backend
- Use pagination for large datasets (already configured)
- Cache frequent queries
- Create database indexes (already done)
- Monitor slow queries

### Database
- Regular backups: `python manage.py dumpdata > backup.json`
- Monitor connection pool
- Archive old records

---

## 🚢 Production Deployment

When ready for production (not yet):

1. **Server Setup**
   - Rent VPS (AWS, DigitalOcean, Heroku)
   - Install Python, Node.js, MySQL
   - Configure firewall

2. **Django Production Config**
   - Set `DEBUG = False`
   - Generate strong `SECRET_KEY`
   - Configure `ALLOWED_HOSTS`
   - Enable SSL/HTTPS

3. **Database Backup**
   - Automated daily backups
   - Off-site storage
   - Test restore procedures

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring
   - Log aggregation

See [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) for detailed production guide.

---

## 💡 Pro Tips

1. **Use Django Admin** to quickly view/edit data
2. **Use Postman** to test API endpoints
3. **Use Browser DevTools** to debug API calls
4. **Keep .env secure** - never commit to git
5. **Backup database regularly** before making changes
6. **Read logs** when something breaks
7. **Test in smaller scope** before full integration

---

## ✅ Checklist for Today

- [ ] Install Python 3.10+
- [ ] Install Node.js 16+
- [ ] Install MySQL 8.0+
- [ ] Run setup.bat (or manual setup)
- [ ] Create MySQL database
- [ ] Run migrations
- [ ] Seed sample data
- [ ] Start Django server
- [ ] Start React server
- [ ] Test both in browser
- [ ] Test API endpoints
- [ ] Read MIGRATION_GUIDE.md
- [ ] Plan React integration

---

## 🎯 Your Next Actions

### Right Now (5 min)
1. Read this file completely
2. Have prerequisites installed
3. Run setup.bat

### Next 30 min
4. Create MySQL database
5. Configure .env file
6. Run migrations
7. Start both servers

### Next 1-2 hours
8. Test everything works
9. Explore Django admin
10. Make API calls with curl

### Next 4-8 hours
11. Start updating React components
12. Connect frontend to Django API
13. Test complete workflows

---

## 📞 Need Help?

1. **Error Message?** → Check [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) troubleshooting
2. **How to migrate?** → See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
3. **What's missing?** → Check [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
4. **General questions?** → Read [README.md](./README.md)

---

## 🎉 Success!

When you see:
- ✅ `http://localhost:5173` loads the React app
- ✅ `http://localhost:8000/api/` shows API documentation
- ✅ `http://localhost:8000/admin/` has data
- ✅ API calls return data

**Congratulations!** Your system is running. Now integrate React with Django per the MIGRATION_GUIDE.md.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready for Setup
