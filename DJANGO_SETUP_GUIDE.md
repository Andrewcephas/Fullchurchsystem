# Django Backend Setup Guide

## Prerequisites

- Python 3.10+
- MySQL 8.0+
- Windows Terminal or Command Prompt

## Installation Steps

### 1. Create MySQL Database

```bash
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE church_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'church_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON church_db.* TO 'church_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Set Up Python Virtual Environment

```bash
# Navigate to project directory
cd c:\coding in progress\church-website

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# Or using:
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=church_db
DB_USER=church_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=3306

# Django Admin
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@church.local
ADMIN_PASSWORD=admin123

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Email Settings (Optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

### 5. Update Django Settings

Edit `church_backend/settings.py` and update:

```python
from decouple import config

DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', 'django.db.backends.mysql'),
        'NAME': config('DB_NAME', 'church_db'),
        'USER': config('DB_USER', 'root'),
        'PASSWORD': config('DB_PASSWORD', ''),
        'HOST': config('DB_HOST', 'localhost'),
        'PORT': config('DB_PORT', '3306'),
    }
}
```

### 6. Run Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
# Follow prompts to create admin user
```

### 8. Seed Initial Data

```bash
python manage.py seed_database
```

### 9. Start Django Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

The API will be available at: `http://localhost:8000/api/`

## API Documentation

### Endpoints Overview

| Resource | Methods | URL |
|----------|---------|-----|
| Branches | GET, POST, PUT, DELETE | `/api/branches/` |
| Members | GET, POST, PUT, DELETE | `/api/members/` |
| User Roles | GET, POST, PUT, DELETE | `/api/user-roles/` |
| Attendance | GET, POST, PUT, DELETE | `/api/attendance/` |
| Finance | GET, POST, PUT, DELETE | `/api/finance/` |
| Events | GET, POST, PUT, DELETE | `/api/events/` |
| Sermons | GET, POST, PUT, DELETE | `/api/sermons/` |
| Notices | GET, POST, PUT, DELETE | `/api/notices/` |
| Prayer Requests | GET, POST, PUT, DELETE | `/api/prayer-requests/` |
| Member Transfers | GET, POST, PUT, DELETE | `/api/member-transfers/` |
| Notifications | GET, POST | `/api/notification-preferences/` |
| Backup Logs | GET, POST | `/api/backup-logs/` |
| Data Access Logs | GET | `/api/data-access-logs/` |
| Analytics | GET | `/api/analytics/` |

### Authentication

The API uses **Django Session-based authentication**. 

For authentication:
1. Login via Django admin (`/admin/`)
2. Use session cookies for subsequent requests
3. Or use token authentication if JWT is enabled

### Rate Limiting

- **Authenticated requests**: 1000 requests/hour
- **Unauthenticated requests**: 100 requests/hour
- **Page size**: 50 items per page

### CORS Configuration

The API is configured for:
- `http://localhost:3000` (React dev server)
- `http://localhost:5173` (Vite dev server)

### Example API Calls

#### Get All Members

```bash
curl -X GET http://localhost:8000/api/members/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

#### Create Finance Record

```bash
curl -X POST http://localhost:8000/api/finance/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": "uuid",
    "category": "tithe",
    "amount": 100.00,
    "payment_method": "cash",
    "giver": "John Doe"
  }'
```

#### Get Finance Summary

```bash
curl -X GET http://localhost:8000/api/finance/summary/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Django Admin Interface

Access at: `http://localhost:8000/admin/`

### Available Admin Functions:
- Member management
- Attendance tracking
- Finance approval
- Event creation
- Sermon management
- User role assignment
- Backup management
- Data access auditing

## Database Schema

### Key Tables:
- **branches**: Church branch information
- **members**: Member profiles with extended fields
- **user_roles**: User role assignments
- **attendance**: Service attendance tracking
- **finance**: Financial transactions
- **events**: Church events
- **sermons**: Sermon records
- **sunday_schools**: Sunday school classes
- **notices**: Church notices
- **prayer_requests**: Prayer requests
- **communications**: Communications/announcements
- **member_transfers**: Member branch transfers
- **notification_preferences**: User notification settings
- **notification_sent**: Notification delivery logs
- **backup_logs**: Database backups
- **data_access_logs**: Access audit trail

## Troubleshooting

### MySQL Connection Error
```
Check MySQL is running:
- Start > Services > MySQL80 > Start (on Windows)
- Verify credentials in settings.py
```

### Migration Errors
```bash
# Reset migrations (development only):
python manage.py migrate api zero

# Recreate migrations:
python manage.py makemigrations
python manage.py migrate
```

### Permission Denied
- Ensure user has appropriate role
- Check UserRole table for assignments
- Review RLS policies

### CORS Issues
- Verify React frontend URL in CORS_ALLOWED_ORIGINS
- Check browser console for CORS errors
- Ensure credentials are sent with requests

## Next Steps

1. **Connect React Frontend**: Update React API calls to use Django endpoints
2. **Authentication**: Implement login page to authenticate via Django
3. **Testing**: Test all API endpoints
4. **Deployment**: Set up production database and Django settings
5. **SSL/HTTPS**: Configure SSL certificates for production

## Support

For issues or questions, check:
- Django documentation: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- MySQL documentation: https://dev.mysql.com/doc/
