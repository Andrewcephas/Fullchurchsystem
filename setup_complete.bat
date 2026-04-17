@echo off
REM Church Management System - Complete Setup Script
REM This script sets up the entire Django + React system

echo.
echo ======================================================
echo   Church Management System - Complete Setup
echo ======================================================
echo.

REM Check prerequisites
echo [*] Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.10+ from: https://www.python.org/
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Prerequisites installed
echo.

REM Create virtual environment
echo [*] Setting up Python virtual environment...
if not exist venv (
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)

REM Activate and install Python packages
echo [*] Installing Python packages...
call venv\Scripts\activate.bat
pip install django djangorestframework django-cors-headers django-filter
if errorlevel 1 (
    echo [ERROR] Failed to install Python packages
    pause
    exit /b 1
)
echo [OK] Python packages installed
echo.

REM Install Node packages
echo [*] Installing Node.js packages...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node packages
    pause
    exit /b 1
)
echo [OK] Node packages installed
echo.

REM Setup Django
echo [*] Setting up Django database...
python manage.py migrate
if errorlevel 1 (
    echo [ERROR] Django migration failed
    echo Make sure the database configuration in .env is correct
    pause
    exit /b 1
)
echo [OK] Database migrations completed
echo.

REM Create superuser
echo [*] Creating Django superuser...
echo You will be prompted to create an admin user for Django
python manage.py createsuperuser
echo [OK] Superuser created
echo.

REM Seed database
echo [*] Seeding database with sample data...
python manage.py seed_database
echo [OK] Database seeded
echo.

echo.
echo ======================================================
echo   SETUP COMPLETE!
echo ======================================================
echo.
echo Your Church Management System is now ready!
echo.
echo To start the system:
echo.
echo 1. Start Django backend:
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo 2. Start React frontend (in another terminal):
echo    npm run dev
echo.
echo Access points:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:8000/api
echo - Admin panel: http://localhost:8000/admin
echo.
echo Default login: Use the superuser credentials you just created
echo.
pause