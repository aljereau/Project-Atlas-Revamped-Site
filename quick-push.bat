@echo off
echo [ATLAS] Quick Push to GitHub
echo ==========================

REM Check if a commit message was provided
if "%~1"=="" (
    echo [INFO] No commit message provided. Using default...
    powershell -ExecutionPolicy Bypass -File "push-to-github.ps1"
) else (
    echo [INFO] Using provided commit message...
    powershell -ExecutionPolicy Bypass -File "push-to-github.ps1" "%*"
)

pause 