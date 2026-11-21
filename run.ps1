$env:PATH = "C:\Program Files\nodejs;$env:PATH"
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  Starting KrishiPulse Web Application..." -ForegroundColor Green
Write-Host "  Open your browser at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
& "C:\Program Files\nodejs\npm.cmd" run dev
