@echo off
title Apex Bank Decision Intelligence System Launcher
echo ======================================================================
echo    Starting Apex Commercial Bank Multi-Agent Decision Intelligence
echo    React.js + FastAPI + CrewAI + Gemini 3.5 Flash
echo ======================================================================

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Apex Bank Backend" cmd /k "backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Frontend on http://localhost:5173 ...
set "PATH=C:\Program Files\nodejs;%PATH%"
cd frontend
start "Apex Bank Frontend" cmd /k "npm.cmd run dev"

timeout /t 2 /nobreak >nul
echo Opening browser...
start http://localhost:5173

echo All systems live! Press any key to exit this launcher window.
pause
