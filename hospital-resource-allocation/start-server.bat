@echo off
title MediAlloc - Hospital Resource Allocation
echo ========================================================
echo   MediAlloc - Smart Hospital Resource Allocation System
echo ========================================================
echo Starting local web server...
echo Serving at: http://localhost:8080/
echo.
timeout /t 1 >nul
start "" "http://localhost:8080/"
node server.js
pause
