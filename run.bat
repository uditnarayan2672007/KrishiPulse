@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo ========================================================
echo   Starting KrishiPulse Web Application...
echo   URL: http://localhost:3000
echo ========================================================
call npm.cmd run dev
pause
