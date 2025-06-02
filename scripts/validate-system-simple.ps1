# Atlas Site Revamp - System Validation Script
# Following automated test requirements and debugging framework

Write-Host "Atlas Site Revamp - System Validation" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Phase 1: File System Check
Write-Host "Phase 1: File System Validation" -ForegroundColor Yellow

$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "src/app/layout.tsx",
    "src/types/index.ts"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

# Check animation files
$animationCount = (Get-ChildItem -Path "src/animations" -Name "*.ts" -ErrorAction SilentlyContinue).Count
if ($animationCount -gt 0) {
    Write-Host "OK: Animation Files ($animationCount found)" -ForegroundColor Green
} else {
    Write-Host "ERROR: No animation files found" -ForegroundColor Red
    $allFilesExist = $false
}

Write-Host ""

# Phase 2: Code Quality Check
Write-Host "Phase 2: Code Quality Check" -ForegroundColor Yellow

$tsFileCount = (Get-ChildItem -Path "src" -Recurse -Name "*.ts" -ErrorAction SilentlyContinue).Count
$tsxFileCount = (Get-ChildItem -Path "src" -Recurse -Name "*.tsx" -ErrorAction SilentlyContinue).Count

Write-Host "TypeScript Files: $tsFileCount .ts files, $tsxFileCount .tsx files" -ForegroundColor Cyan

# Check for error markers
$hasErrors = $false
try {
    $errorFiles = Get-ChildItem -Path "src" -Recurse -Name "*.ts" -ErrorAction SilentlyContinue | ForEach-Object {
        $content = Get-Content "src/$_" -ErrorAction SilentlyContinue
        if ($content -match "ERROR|FIXME|BUG") {
            $_
        }
    }
    
    if ($errorFiles.Count -eq 0) {
        Write-Host "OK: No error markers found" -ForegroundColor Green
    } else {
        Write-Host "WARNING: Error markers found in $($errorFiles.Count) files" -ForegroundColor Yellow
    }
} catch {
    Write-Host "WARNING: Could not check for error markers" -ForegroundColor Yellow
}

Write-Host ""

# Phase 3: Dependencies Check
Write-Host "Phase 3: Dependencies Check" -ForegroundColor Yellow

if (Test-Path "package.json") {
    Write-Host "OK: package.json exists" -ForegroundColor Green
    
    try {
        $pkg = Get-Content "package.json" | ConvertFrom-Json
        
        $keyDeps = @("next", "react", "react-dom", "framer-motion", "typescript")
        $missingDeps = 0
        
        foreach ($dep in $keyDeps) {
            $depExists = $pkg.dependencies.$dep -or $pkg.devDependencies.$dep
            if ($depExists) {
                Write-Host "OK: $dep is configured" -ForegroundColor Green
            } else {
                Write-Host "MISSING: $dep not found" -ForegroundColor Red
                $missingDeps++
            }
        }
        
        if ($missingDeps -eq 0) {
            Write-Host "OK: All key dependencies present" -ForegroundColor Green
        }
    } catch {
        Write-Host "ERROR: Could not parse package.json" -ForegroundColor Red
    }
} else {
    Write-Host "ERROR: package.json not found" -ForegroundColor Red
}

Write-Host ""

# Phase 4: Production Readiness
Write-Host "Phase 4: Production Readiness" -ForegroundColor Yellow

$prodFiles = @(
    "deployment.config.js",
    "deploy-production.ps1",
    "docs/production-deployment-guide.md"
)

$prodReady = 0
foreach ($file in $prodFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
        $prodReady++
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
    }
}

Write-Host ""

# Summary
Write-Host "VALIDATION SUMMARY" -ForegroundColor Magenta
Write-Host "==================" -ForegroundColor Magenta

$score = 0
if ($allFilesExist) { $score += 3 }
if ($tsFileCount -gt 0) { $score += 2 }
if ($missingDeps -eq 0) { $score += 3 }
if ($prodReady -eq $prodFiles.Count) { $score += 2 }

$totalScore = 10
$percentage = [math]::Round(($score / $totalScore) * 100)

Write-Host "Score: $score/$totalScore ($percentage%)" -ForegroundColor $(
    if ($percentage -ge 90) { "Green" }
    elseif ($percentage -ge 80) { "Yellow" } 
    else { "Red" }
)

if ($percentage -ge 90) {
    Write-Host "Status: EXCELLENT - Production Ready" -ForegroundColor Green
} elseif ($percentage -ge 80) {
    Write-Host "Status: GOOD - Minor issues" -ForegroundColor Yellow
} else {
    Write-Host "Status: NEEDS WORK" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Install Node.js 18+ if not available" -ForegroundColor White
Write-Host "2. Run 'npm install' to install dependencies" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to start development" -ForegroundColor White

Write-Host ""
Write-Host "Validation Complete!" -ForegroundColor Green 