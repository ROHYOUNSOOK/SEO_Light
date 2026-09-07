@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist node_modules (
  echo 의존성 설치 중...
  call npm install
)
start "" http://localhost:3000
node --env-file-if-exists=.env server.js
pause
