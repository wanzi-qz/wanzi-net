@echo off
cd /d "%~dp0"
echo Starting dev server: http://localhost:5173/
call npm.cmd run dev
pause
