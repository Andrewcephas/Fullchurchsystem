# Deployment Configuration Guide

## Overview
- **Backend**: Django → Deploy on Render
- **Frontend**: React (Vite) → Deploy on Vercel

---

## BACKEND - Render Deployment

### 1. Render Settings

**Service Type**: Web Service

**Root Directory**: (leave empty - repository root)

**Build Command**:
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**Start Command**:
```bash
gunicorn church_backend.wsgi:application --bind 0.0.0.0:$PORT
```

**Environment Variables** (set in Render dashboard):

| Variable | Value | Description |
|----------|-------|-------------|
| `SECRET_KEY` | (generate secure key) | Django secret key |
| `DEBUG` | `False` | Debug mode |
| `ALLOWED_HOSTS` | `your-app-name.onrender.com` | Allowed hosts (comma-separated) |
| `DATABASE_URL` | (PostgreSQL connection from Render) | PostgreSQL database URL |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Frontend URL for CORS |
| `SESSION_COOKIE_SECURE` | `True` | Secure cookies (HTTPS) |
| `CSRF_COOKIE_SECURE` | `True` | Secure CSRF cookies |
| `CSRF_TRUSTED_ORIGINS` | `https://your-app-name.onrender.com` | Trusted origins |
| `SECURE_SSL_REDIRECT` | `True` | Redirect HTTP to HTTPS |

**Note**: Render automatically provides `DATABASE_URL` when you add a PostgreSQL database instance. Just select "Connect a Database" and it will set the environment variable.

### 2. Required Files (Backend)

✅ **church_backend/settings.py** - Updated with:
- Environment-based configuration
- dj-database-url for database
- WhiteNoise for static files
- Production-ready security settings

✅ **requirements.txt** - Updated with:
- gunicorn (WSGI server)
- dj-database-url (database config)
- whitenoise (static files)
- psycopg2-binary (PostgreSQL adapter)

✅ **build.sh** - Collects static files and runs migrations

✅ **wsgi.py** - Already configured correctly

### 3. Static Files on Render

Render's filesystem is ephemeral. Static files are collected during build and served via WhiteNoise. Ensure:

1. `STATIC_ROOT = BASE_DIR / 'staticfiles'` (already set)
2. `STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'` (already set)
3. Build command includes `python manage.py collectstatic --noinput`

### 4. Database on Render

1. Create a PostgreSQL database in Render (separate from web service or together)
2. Render auto-creates `DATABASE_URL` environment variable
3. No additional configuration needed - dj-database-url handles it

---

## FRONTEND - Vercel Deployment

### 1. Vercel Settings

**Framework Preset**: Vite (or Other)

**Root Directory**: (leave empty - repository root, or `/`)

**Build Command**:
```bash
npm run build
```

**Output Directory**: `dist`

**Environment Variables** (set in Vercel dashboard):

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API URL |

### 2. Required Files (Frontend)

✅ **vercel.json** - Configured for Vite static build

✅ **.env.production.example** - Template for production env vars

✅ **src/services/api.ts** - Already uses `import.meta.env.VITE_API_URL`

✅ **vite.config.ts** - Already configured correctly

### 3. Build Settings

Vite automatically builds to `dist/` directory. vercel.json specifies `dist` as output.

---

## CONNECTION - Frontend ↔ Backend

### How It Works

1. **Frontend** makes API calls to `VITE_API_URL` (e.g., `https://backend.onrender.com/api/...`)
2. **Backend** receives requests and processes them via Django
3. **CORS** allows frontend origin via `CORS_ALLOWED_ORIGINS`

### CORS Configuration

In Django settings.py:
```python
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = True  # Allows cookies/session auth
```

Set in Render: `CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app.vercel.app`

### API Calls Flow

```
React (Vercel) → Fetch/Axios → https://backend.onrender.com/api/endpoint/
                     ↓
                Django (Render)
                     ↓
                JSON Response
```

---

## FINAL CHECKLIST

### Files Created/Modified

#### Backend (Render)
- ✅ **church_backend/settings.py** - Production configuration
- ✅ **requirements.txt** - Added gunicorn, dj-database-url, whitenoise, psycopg2-binary
- ✅ **build.sh** - Build script for Render (root directory)
- ✅ **.env.production.example** - Backend env template

#### Frontend (Vercel)
- ✅ **vercel.json** - Vercel deployment config
- ✅ **.env.production.example** - Frontend env template

### Common Deployment Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Static files not found (404)` | collectstatic not run | Ensure build command includes `python manage.py collectstatic --noinput` |
| `ModuleNotFoundError: No module named 'whitenoise'` | Missing dependency | `whitenoise` added to requirements.txt |
| `DisallowedHost` | ALLOWED_HOSTS not set | Set `ALLOWED_HOSTS` to your Render domain |
| `CORS error` | Frontend URL not in CORS_ALLOWED_ORIGINS | Add Vercel URL to `CORS_ALLOWED_ORIGINS` |
| `Database connection error` | DATABASE_URL missing | Connect PostgreSQL database in Render dashboard |
| `ImportError: No module named 'dj_database_url'` | Missing package | `dj-database-url` added to requirements.txt |
| `Error: Cannot find module 'vite'` | Dependencies not installed | Vercel auto-installs from package.json |
| `Server error: Application failed to respond` | Build script errors | Check Render logs, ensure build.sh is executable |
| `500 Internal Server Error` | Missing SECRET_KEY | Set `SECRET_KEY` in environment variables |
| `CSRF token missing` | CSRF cookie not sent | Ensure `credentials: 'include'` in fetch requests |

### Before Deploying

1. **Update ALLOWED_HOSTS** in .env.production.example with your actual Render domain
2. **Update CORS_ALLOWED_ORIGINS** with your actual Vercel domain
3. **Generate SECRET_KEY**: Run `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
4. **Test locally** with production settings:
   ```bash
   cd church_backend
   python manage.py collectstatic --noinput
   gunicorn church_backend.wsgi:application
   ```
5. **Commit all changes** to git before deploying

### Render Deployment Steps

1. Push code to GitHub
2. In Render, create new **Web Service**
3. Connect repository
4. Set:
   - **Root Directory**: (empty)
   - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn church_backend.wsgi:application --bind 0.0.0.0:$PORT`
5. Add environment variables (from .env.production.example)
6. Add PostgreSQL database (auto-sets DATABASE_URL)
7. Deploy

### Vercel Deployment Steps

1. Push code to GitHub (or already pushed)
2. In Vercel, import repository
3. Framework preset: **Vite**
4. Root Directory: (empty) or `/`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variable `VITE_API_URL` = your Render backend URL
8. Deploy

### Post-Deployment Verification

1. **Backend Health Check**: `https://your-backend.onrender.com/api/` (should return 404 or API root)
2. **Frontend Load**: `https://your-frontend.vercel.app` (should load React app)
3. **API Call Test**: Login or fetch data from frontend
4. **CORS Check**: Browser console should show no CORS errors
5. **Static Files**: CSS/JS should load (check Network tab)

---

## Notes

- Render provides ephemeral filesystem - static files collected at build time
- Vercel automatically detects Vite projects; vercel.json is optional but useful for config
- Always use HTTPS in production (SECURE_SSL_REDIRECT=True)
- Keep DEBUG=False in production
- Never commit .env files with secrets
