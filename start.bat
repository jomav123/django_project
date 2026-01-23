@echo off
title Game Hub Server
color 0A

echo.
echo ========================================
echo       GAME HUB - SERVER MANAGER
echo ========================================
echo.

REM Navigate to project directory
cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv" (
    echo [SETUP] Virtual environment not found. Creating...
    echo.
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        echo Make sure Python is installed and in PATH.
        pause
        exit /b 1
    )
    echo [SETUP] Virtual environment created successfully!
    echo.
)

REM Activate virtual environment
echo [SETUP] Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if requirements are installed
echo [SETUP] Checking dependencies...
pip show django >nul 2>&1
if errorlevel 1 (
    echo [SETUP] Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo [SETUP] Dependencies installed!
    echo.
)

REM Run migrations
echo [SETUP] Running database migrations...
python manage.py makemigrations --noinput >nul 2>&1
python manage.py migrate --noinput
if errorlevel 1 (
    echo WARNING: Some migrations failed, but continuing...
)

REM Create default games if they don't exist
echo [SETUP] Setting up games...
python setup_games.py

echo.
echo ========================================
echo    STARTING DJANGO DEVELOPMENT SERVER
echo ========================================
echo.
echo Server will open at: http://127.0.0.1:8000/
echo.
echo Opening browser automatically...
echo (Server will start in separate window)
echo.
echo ========================================
echo.

REM Start server in new window and open browser after delay
start "Game Hub Server" cmd /k "python manage.py runserver && pause"

REM Wait for server to start (3 seconds)
timeout /t 3 /nobreak >nul

REM Open browser - try Opera first, then default
if exist "%LOCALAPPDATA%\Programs\Opera\opera.exe" (
    start "" "%LOCALAPPDATA%\Programs\Opera\opera.exe" "http://127.0.0.1:8000/"
) else if exist "%ProgramFiles%\Opera\opera.exe" (
    start "" "%ProgramFiles%\Opera\opera.exe" "http://127.0.0.1:8000/"
) else (
    REM Use default browser
    start "" "http://127.0.0.1:8000/"
)

echo.
echo ✓ Browser opened!
echo ✓ Server is running in separate window
echo.
echo To stop server: Close the "Game Hub Server" window
echo.
pause

