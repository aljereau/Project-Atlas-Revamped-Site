# 🧪 Atlas Site Revamp - System Validation Script
# Following @automated-test-requirements-001.mdc and @debugging-framework-guide-001.md

Write-Host "🚀 Atlas Site Revamp - Comprehensive System Validation" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""

# Phase 1: Environment Check
Write-Host "📋 Phase 1: Environment Validation" -ForegroundColor Yellow
Write-Host "-----------------------------------"

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        $nodeInstalled = $true
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js: Not installed or not in PATH" -ForegroundColor Red
    Write-Host "   Recommendation: Install Node.js 18+ from https://nodejs.org/" -ForegroundColor Yellow
    $nodeInstalled = $false
}

# Check if npm is available
if ($nodeInstalled) {
    try {
        $npmVersion = npm --version 2>$null
        Write-Host "✅ NPM: $npmVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ NPM: Not available" -ForegroundColor Red
    }
}

Write-Host ""

# Phase 2: File System Validation
Write-Host "📁 Phase 2: File System Validation" -ForegroundColor Yellow
Write-Host "-----------------------------------"

$requiredFiles = @(
    "package.json",
    "tsconfig.json",
    "src/app/layout.tsx",
    "src/types/index.ts",
    "src/types/browser-apis.d.ts"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

# Check animation files
$animationFiles = Get-ChildItem -Path "src/animations" -Name "*.ts" -ErrorAction SilentlyContinue
if ($animationFiles) {
    Write-Host "✅ Animation Files: $($animationFiles.Count) files found" -ForegroundColor Green
} else {
    Write-Host "❌ Animation Files: Directory missing or empty" -ForegroundColor Red
}

Write-Host ""

# Phase 3: Code Quality Validation
Write-Host "🔍 Phase 3: Code Quality Validation" -ForegroundColor Yellow
Write-Host "------------------------------------"

# Check for error markers
$errorMarkers = Get-ChildItem -Path "src" -Recurse -Name "*.ts" -ErrorAction SilentlyContinue | 
    ForEach-Object { Select-String -Path "src/$_" -Pattern "ERROR|FIXME|TODO|BUG" -ErrorAction SilentlyContinue }

if ($errorMarkers.Count -eq 0) {
    Write-Host "✅ Code Quality: No error markers found" -ForegroundColor Green
} else {
    Write-Host "⚠️ Code Quality: $($errorMarkers.Count) markers found" -ForegroundColor Yellow
}

# Check TypeScript file count
$tsFiles = Get-ChildItem -Path "src" -Recurse -Name "*.ts" -ErrorAction SilentlyContinue
$tsxFiles = Get-ChildItem -Path "src" -Recurse -Name "*.tsx" -ErrorAction SilentlyContinue
Write-Host "📊 TypeScript Files: $($tsFiles.Count) .ts files, $($tsxFiles.Count) .tsx files" -ForegroundColor Cyan

Write-Host ""

# Phase 4: Dependency Validation
Write-Host "📦 Phase 4: Dependency Validation" -ForegroundColor Yellow
Write-Host "----------------------------------"

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    
    # Key dependencies check
    $keyDeps = @("next", "react", "react-dom", "framer-motion", "typescript")
    foreach ($dep in $keyDeps) {
        if ($packageJson.dependencies.$dep -or $packageJson.devDependencies.$dep) {
            $version = if ($packageJson.dependencies.$dep) { $packageJson.dependencies.$dep } else { $packageJson.devDependencies.$dep }
            Write-Host "✅ $dep`: $version" -ForegroundColor Green
        } else {
            Write-Host "❌ $dep`: Missing" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ package.json: Not found" -ForegroundColor Red
}

Write-Host ""

# Phase 5: Production Readiness
Write-Host "🚀 Phase 5: Production Readiness" -ForegroundColor Yellow
Write-Host "---------------------------------"

$productionFiles = @(
    "deployment.config.js",
    "deploy-production.ps1",
    "docs/production-deployment-guide.md"
)

foreach ($file in $productionFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

Write-Host ""

# Phase 6: Runtime Testing (if Node.js available)
Write-Host "🧪 Phase 6: Runtime Testing" -ForegroundColor Yellow
Write-Host "----------------------------"

if ($nodeInstalled -and (Test-Path "package.json")) {
    Write-Host "🔧 Node.js detected - Running automated tests..." -ForegroundColor Cyan
    
    # Check if node_modules exists
    if (Test-Path "node_modules") {
        Write-Host "✅ Dependencies: node_modules exists" -ForegroundColor Green
        
        # Run type checking
        try {
            Write-Host "🔍 Running TypeScript type checking..." -ForegroundColor Cyan
            $result = npm run type-check 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ TypeScript: Type checking passed" -ForegroundColor Green
            } else {
                Write-Host "❌ TypeScript: Type checking failed" -ForegroundColor Red
                Write-Host $result -ForegroundColor Red
            }
        } catch {
            Write-Host "⚠️ TypeScript: Could not run type checking" -ForegroundColor Yellow
        }
        
        # Run build test
        try {
            Write-Host "🏗️ Testing production build..." -ForegroundColor Cyan
            $buildResult = npm run build 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Build: Production build successful" -ForegroundColor Green
            } else {
                Write-Host "❌ Build: Production build failed" -ForegroundColor Red
            }
        } catch {
            Write-Host "⚠️ Build: Could not run build test" -ForegroundColor Yellow
        }
        
    } else {
        Write-Host "⚠️ Dependencies: Run 'npm install' first" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️ Runtime Testing: Requires Node.js installation" -ForegroundColor Yellow
    Write-Host "   Install Node.js to enable automated runtime testing" -ForegroundColor Cyan
}

Write-Host ""

# Final Summary
Write-Host "📊 VALIDATION SUMMARY" -ForegroundColor Magenta
Write-Host "=====================" -ForegroundColor Magenta

$score = 0
$maxScore = 10

# Environment (1 point)
if ($nodeInstalled) { $score += 1 }

# File System (3 points)
if ($missingFiles.Count -eq 0) { $score += 2 }
if ($animationFiles.Count -gt 0) { $score += 1 }

# Code Quality (2 points)
if ($errorMarkers.Count -eq 0) { $score += 1 }
if ($tsFiles.Count -gt 0) { $score += 1 }

# Dependencies (2 points)
if (Test-Path "package.json") { $score += 1 }
if ($packageJson -and $packageJson.dependencies.next) { $score += 1 }

# Production Ready (2 points)
$productionReady = ($productionFiles | Where-Object { Test-Path $_ }).Count
if ($productionReady -eq $productionFiles.Count) { $score += 2 }
elseif ($productionReady -gt 0) { $score += 1 }

$percentage = [math]::Round(($score / $maxScore) * 100, 1)

Write-Host ""
Write-Host "🎯 Overall Score: $score/$maxScore ($percentage%)" -ForegroundColor $(
    if ($percentage -ge 90) { "Green" }
    elseif ($percentage -ge 80) { "Yellow" }
    else { "Red" }
)

if ($percentage -ge 90) {
    Write-Host "🏆 Status: EXCELLENT - Production Ready!" -ForegroundColor Green
} elseif ($percentage -ge 80) {
    Write-Host "✅ Status: GOOD - Minor improvements needed" -ForegroundColor Yellow
} elseif ($percentage -ge 60) {
    Write-Host "⚠️ Status: FAIR - Several issues to address" -ForegroundColor Yellow
} else {
    Write-Host "❌ Status: NEEDS WORK - Major issues found" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
if (-not $nodeInstalled) {
    Write-Host "   1. Install Node.js 18+ from https://nodejs.org/" -ForegroundColor White
    Write-Host "   2. Run 'npm install' to install dependencies" -ForegroundColor White
    Write-Host "   3. Run 'npm run dev' to start development server" -ForegroundColor White
} else {
    Write-Host "   1. Run 'npm install' if not done already" -ForegroundColor White
    Write-Host "   2. Run 'npm run dev' to start development server" -ForegroundColor White
    Write-Host "   3. Run 'npm run build' to test production build" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Validation Complete!" -ForegroundColor Green 