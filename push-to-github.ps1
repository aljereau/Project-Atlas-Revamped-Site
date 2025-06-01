# Atlas Site Revamp - GitHub Push Script
# Usage: .\push-to-github.ps1 "Your commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage
)

Write-Host "🚀 Atlas Site Revamp - GitHub Push Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if we're in a git repository
if (!(Test-Path ".git")) {
    Write-Host "❌ Error: Not in a git repository!" -ForegroundColor Red
    exit 1
}

# Check if there are changes to commit
$status = git status --porcelain
if (!$status) {
    Write-Host "✅ No changes to commit. Repository is up to date!" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Changes detected. Preparing to commit and push..." -ForegroundColor Yellow

# Add all changes
Write-Host "Adding all changes..." -ForegroundColor White
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to add changes!" -ForegroundColor Red
    exit 1
}

# Commit with provided message
Write-Host "Committing changes with message: '$CommitMessage'" -ForegroundColor White
git commit -m $CommitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to commit changes!" -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor White
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to push to GitHub!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🔗 Repository: https://github.com/aljereau/Project-Atlas-Revamped-Site" -ForegroundColor Cyan

# Show git log for confirmation
Write-Host "`n📊 Recent commits:" -ForegroundColor Yellow
git log --oneline -3 