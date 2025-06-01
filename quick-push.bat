@echo off
echo 🚀 Atlas Site Revamp - Quick Push to GitHub
echo ==========================================

if "%1"=="" (
    set "commit_msg=Update Atlas Site Revamp project"
) else (
    set "commit_msg=%*"
)

echo Adding all changes...
git add .

echo Committing with message: "%commit_msg%"
git commit -m "%commit_msg%"

echo Pushing to GitHub...
git push origin main

if %errorlevel% == 0 (
    echo ✅ Successfully pushed to GitHub!
    echo 🔗 https://github.com/aljereau/Project-Atlas-Revamped-Site
) else (
    echo ❌ Error occurred during push!
)

pause 