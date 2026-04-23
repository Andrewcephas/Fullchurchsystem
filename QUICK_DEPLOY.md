# ⚡ QUICK DEPLOYMENT REFERENCE

## Render (Backend) - Exact Settings

**Service Type**: Web Service

**Configuration**:
- **Root Directory**: *(leave blank)*
- **Build Command**:
  ```
  pip install -r requirements.txt && python church_backend/manage.py collectstatic --noinput
  ```
- **Start Command**:
  ```
  gunicorn church_backend.wsgi:application --bind 0.0.0.0:$PORT
  ```
- **Runtime**: Python 3.11 (or leave default)

**Environment Variables** (add these in Render dashboard):

| Key | Value |
|-----|-------|
| `SECRET_KEY` | *(Render can generate)* |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `your-backend.onrender.com` |
| `DATABASE_URL` | *(auto-added when you attach PostgreSQL)* |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app,https://www.your-frontend.vercel.app` |
| `SESSION_COOKIE_SECURE` | `True` |
| `CSRF_COOKIE_SECURE` | `True` |
| `CSRF_TRUSTED_ORIGINS` | `https://your-backend.onrender.com` |
| `SECURE_SSL_REDIRECT` | `True` |

**Database**:
- Click "Add Database" → PostgreSQL
- Name: `church_db` (or any)
- Render automatically adds `DATABASE_URL` env var

---

## Vercel (Frontend) - Exact Settings

**Framework Preset**: Vite

**Configuration**:
- **Root Directory**: *(leave blank)*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (default)

**Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` |

---

## Important Notes

1. **Deploy Backend First**: Get your Render URL, then use it in Vercel's `VITE_API_URL`
2. **CORS**: Backend's `CORS_ALLOWED_ORIGINS` must include your Vercel domain
3. **Static Files**: Render build runs `collectstatic`; WhiteNoise serves them
4. **Database**: Render's PostgreSQL gives you `DATABASE_URL` automatically
5. **No Poetry/Pipfile**: Using plain `requirements.txt` (Pipfile removed to avoid conflicts)

---

## Files Modified/Created

```
✅ church_backend/settings.py   (production config)
✅ requirements.txt              (added gunicorn, dj-db-url, whitenoise, psycopg2)
✅ build.sh                      (build script at root)
✅ .env.production.example       (backend env template)
✅ vercel.json                   (frontend deployment config)
✅ .env.production.example       (frontend env template - duplicate name? Actually same file)
✅ DEPLOYMENT_GUIDE.md           (full guide)
✅ render.yaml                   ( Infrastructure as Code - optional)
```

---

## Common Errors

| Error | Fix |
|-------|-----|
| `requirements.txt not found` | Ensure file is at repo root, not inside church_backend/ |
| `Module 'whitenoise' not found` | `whitenoise` is in requirements.txt; re-deploy |
| `DisallowedHost` | Set `ALLOWED_HOSTS` to your Render domain |
| `CORS error in browser` | Add Vercel URL to `CORS_ALLOWED_ORIGINS` |
| `Database connection failed` | Attach PostgreSQL in Render; wait for `DATABASE_URL` |
| `Static files 404` | Verify `collectstatic` ran in build logs |
| `Gunicorn not found` | `gunicorn` is in requirements.txt; redeploy |
| `CSRF 403` | Ensure frontend sends credentials; `CSRF_TRUSTED_ORIGINS` set |

---

## Testing After Deploy

1. **Backend health**: `https://your-backend.onrender.com/api/` → should return JSON (404 is ok if endpoint doesn't exist, but not 500)
2. **Frontend**: `https://your-frontend.vercel.app` → React loads
3. **API call from frontend**: Login/register → should succeed
4. **CORS check**: Browser console → no CORS errors
5. **Static files**: CSS/JS loaded (check Network tab for 200s on static files)

---

## Secrets Generation

Generate a Django SECRET_KEY:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

## Support

- Render Python docs: https://render.com/docs/python
- Vercel Vite docs: https://vercel.com/docs/frameworks/vite
- Full guide: `DEPLOYMENT_GUIDE.md`
