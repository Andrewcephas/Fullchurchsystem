@echo off
REM Church Website - Setup & Development Server Script
REM This script helps with initial setup and running the development environment

setlocal enabledelayedexpansion

echo.
echo ======================================================
echo   Church Website - Setup & Development
echo ======================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python and Node.js are installed
echo.

REM Menu
:menu
echo Choose an option:
echo 1. First-time setup (install dependencies, create venv)
echo 2. Activate virtual environment
echo 3. Start Django server
echo 4. Start React development server
echo 5. Run both servers (requires two terminal windows)
echo 6. Database setup (MySQL)
echo 7. Run migrations
echo 8. Seed database
echo 9. Create superuser
echo 0. Exit
echo.
set /p choice="Enter your choice [0-9]: "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto activate
if "%choice%"=="3" goto django
if "%choice%"=="4" goto react
if "%choice%"=="5" goto both
if "%choice%"=="6" goto mysql
if "%choice%"=="7" goto migrate
if "%choice%"=="8" goto seed
if "%choice%"=="9" goto superuser
if "%choice%"=="0" goto end
goto menu

:setup
echo.
echo [*] Running first-time setup...
echo.

REM Create Python virtual environment
if not exist "venv" (
    echo [*] Creating Python virtual environment...
    python -m venv venv
    echo [OK] Virtual environment created
) else (
    echo [!] Virtual environment already exists
)

REM Activate virtual environment
echo [*] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo [*] Installing Python dependencies...
pip install -r requirements.txt

REM Install Node dependencies
echo [*] Installing Node.js dependencies...
call npm install

echo.
echo [OK] Setup complete!
echo.
echo Next steps:
echo   1. Configure MySQL database (see DJANGO_SETUP_GUIDE.md)
echo   2. Copy .env.example to .env and update with your settings
echo   3. Run option 7 to apply migrations
echo   4. Run option 8 to seed database
echo   5. Run option 3 to start Django server
echo.
pause
goto menu

:activate
echo.
echo [*] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated
echo.
cmd /k
goto menu

:django
echo.
echo [*] Starting Django development server...
echo [*] Server will be available at: http://localhost:8000
echo [*] API documentation: http://localhost:8000/api/
echo [*] Admin interface: http://localhost:8000/admin/
echo [*] Press CTRL+C to stop the server
echo.
call venv\Scripts\activate.bat
python manage.py runserver 0.0.0.0:8000
goto menu

:react
echo.
echo [*] Starting React development server...
echo [*] Server will be available at: http://localhost:5173
echo [*] Press CTRL+C to stop the server
echo.
npm run dev
goto menu

:both
echo.
echo [*] To run both servers, you need to open two terminal windows:
echo.
echo   Window 1 (Django):
echo     1. Run: venv\Scripts\activate.bat
echo     2. Run: python manage.py runserver
echo.
echo   Window 2 (React):
echo     1. Run: npm run dev
echo.
pause
goto menu

:mysql
echo.
echo [*] MySQL Setup Instructions
echo.
echo   1. Open MySQL command line or MySQL Workbench
echo   2. Run these commands:
echo.
echo   mysql -u root -p
echo.
echo   CREATE DATABASE church_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
echo   CREATE USER 'church_user'@'localhost' IDENTIFIED BY 'your_secure_password';
echo   GRANT ALL PRIVILEGES ON church_db.* TO 'church_user'@'localhost';
echo   FLUSH PRIVILEGES;
echo   EXIT;
echo.
echo   3. Update the .env file with your credentials
echo.
pause
goto menu

:migrate
echo.
echo [*] Running Django migrations...
call venv\Scripts\activate.bat
python manage.py makemigrations
python manage.py migrate
echo [OK] Migrations complete
echo.
pause
goto menu

:seed
echo.
echo [*] Seeding database with initial data...
call venv\Scripts\activate.bat
python manage.py seed_database
echo [OK] Database seeded
echo.
pause
goto menu

:superuser
echo.
echo [*] Creating superuser...
call venv\Scripts\activate.bat
python manage.py createsuperuser
echo [OK] Superuser created
echo.
pause
goto menu

:end
echo.
echo Thank you for using Church Website!
echo.
exit /b 0
