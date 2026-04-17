# Church Management System

A comprehensive web application for managing church operations, member profiles, finances, attendance, events, and communications.

**Status**: ✅ Supabase removed, Django backend fully implemented

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for navigation
- **Tanstack React Query** for data fetching
- **Recharts** for analytics
- **Tailwind CSS** for styling
- **Shadcn UI** for component library
- **Vite** as build tool

### Backend
- **Django 4.2** web framework
- **Django REST Framework** for APIs
- **SQLite** database (temporary - can be changed to MySQL)
- **Django ORM** for database operations
- **CORS** for cross-origin requests

### Features
- Session-based authentication
- Role-based access control
- RESTful API design
- Comprehensive admin interface
- Database migrations

## Quick Start

### Option 1: Using Setup Script (Windows)
```bash
# Run the setup script
setup.bat

# Follow the menu options for:
# 1. First-time setup
# 2. Database configuration
# 3. Running migrations
# 4. Starting servers
```

### Option 2: Manual Setup

#### Prerequisites
- Python 3.10+
- Node.js 16+
- MySQL 8.0+

#### Frontend Setup
```bash
# Install Node dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

#### Backend Setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure database
# 1. Create MySQL database (see DJANGO_SETUP_GUIDE.md)
# 2. Copy .env.example to .env and update credentials

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed initial data
python manage.py seed_database

# Start development server
python manage.py runserver
```

Backend API will be available at `http://localhost:8000/api`
Django Admin at `http://localhost:8000/admin`

## Project Structure

```
church-website/
├── src/
│   ├── components/          # React components
│   │   ├── admin/          # Admin pages
│   │   ├── ui/             # UI components
│   │   └── ...
│   ├── pages/              # Page components
│   ├── hooks/              # React hooks
│   ├── services/
│   │   └── api.ts          # Django API client
│   ├── App.tsx
│   └── main.tsx
├── api/                     # Django API app
│   ├── models.py           # Database models
│   ├── serializers.py      # API serializers
│   ├── views.py            # API viewsets
│   ├── urls.py             # API routes
│   ├── admin.py            # Admin configuration
│   └── management/
│       └── commands/
│           └── seed_database.py
├── church_backend/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py               # Django CLI
├── requirements.txt        # Python dependencies
├── package.json            # Node.js dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind configuration
├── DJANGO_SETUP_GUIDE.md  # Detailed Django setup
└── MIGRATION_GUIDE.md     # React to Django migration guide
```

## API Documentation

### Base URL
```
http://localhost:8000/api
```

### Key Endpoints

#### Branches
- `GET /api/branches/` - List all branches
- `POST /api/branches/` - Create new branch
- `GET /api/branches/{id}/` - Get branch details
- `PUT /api/branches/{id}/` - Update branch
- `DELETE /api/branches/{id}/` - Delete branch

#### Members
- `GET /api/members/` - List members (with filtering)
- `POST /api/members/` - Create new member
- `GET /api/members/{id}/` - Get member details
- `GET /api/members/{id}/profile/` - Get full profile
- `PUT /api/members/{id}/` - Update member
- `DELETE /api/members/{id}/` - Delete member

#### Finance
- `GET /api/finance/` - List financial records
- `GET /api/finance/summary/` - Get financial summary
- `GET /api/finance/export_report/` - Export report
- `POST /api/finance/` - Create financial record
- `PUT /api/finance/{id}/` - Update financial record

#### Analytics
- `GET /api/analytics/member_growth/` - Member statistics
- `GET /api/analytics/attendance_summary/` - Attendance stats
- `GET /api/analytics/financial_summary/` - Finance stats

#### Other Resources
- Member Transfers: `/api/member-transfers/`
- Attendance: `/api/attendance/`
- Events: `/api/events/`
- Sermons: `/api/sermons/`
- Notices: `/api/notices/`
- Prayer Requests: `/api/prayer-requests/`
- Notifications: `/api/notification-preferences/`
- Backup Logs: `/api/backup-logs/`

See [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) for detailed API documentation.

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.mysql
DB_NAME=church_db
DB_USER=church_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

See [.env.example](./.env.example) for all available options.

## Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
python manage.py runserver           # Start dev server
python manage.py makemigrations      # Create migrations
python manage.py migrate             # Apply migrations
python manage.py createsuperuser     # Create admin user
python manage.py shell               # Django shell
```

### Database Management
```bash
# Backup database
mysqldump -u church_user -p church_db > backup.sql

# Restore database
mysql -u church_user -p church_db < backup.sql

# Or use Django:
python manage.py dumpdata > backup.json
python manage.py loaddata backup.json
```

## Security Considerations

### For Development
- ✅ Debug mode enabled
- ✅ CORS enabled for localhost
- ✅ Session-based authentication
- ✅ Default SQLite passwords (change immediately!)

### For Production
- ❌ Set `DEBUG = False`
- ❌ Generate strong `SECRET_KEY`
- ❌ Configure `ALLOWED_HOSTS`
- ❌ Use environment variables for sensitive data
- ❌ Enable `HTTPS`
- ❌ Set `SESSION_COOKIE_SECURE = True`
- ❌ Configure database backups
- ❌ Set strong database passwords

See [DJANGO_SETUP_GUIDE.md](./DJANGO_SETUP_GUIDE.md) for production deployment guide.

## Troubleshooting

### MySQL Connection Issues
```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Check user permissions
SHOW GRANTS FOR 'church_user'@'localhost';
```

### Migration Errors
```bash
# Check migration status
python manage.py showmigrations

# Reset migrations (development only)
python manage.py migrate api zero
python manage.py makemigrations
python manage.py migrate
```

### CORS Errors
- Verify React URL in `CORS_ALLOWED_ORIGINS`
- Check browser console for specific errors
- Ensure credentials are sent with requests

### Port Already in Use
```bash
# Django on different port
python manage.py runserver 8001

# React on different port
npm run dev -- --port 5174
```

## Support & Documentation

- [Django Setup Guide](./DJANGO_SETUP_GUIDE.md) - Complete installation and configuration
- [Migration Guide](./MIGRATION_GUIDE.md) - React to Django API migration
- [Django Docs](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Docs](https://react.dev/)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or feature requests, please open an issue or contact the development team.

---

**Last Updated**: 2024
**Version**: 1.0.0
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5dde40ba-96bd-4e1c-95ea-50d5030f18e1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
#   F u l l c h u r c h s y s t e m  
 #   F u l l c h u r c h s y s t e m  
 #   F u l l c h u r c h s y s t e m  
 