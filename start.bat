@echo off
echo 🚀 启动文档思维导图生成器...

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python，请先安装 Python 3.8+
    pause
    exit /b 1
)

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

REM 检查后端依赖
if not exist "backend\__pycache__" (
    echo 📦 安装后端依赖...
    pip install -r requirements.txt
)

REM 检查前端依赖
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
)

REM 启动后端（新窗口）
echo 🔧 启动后端服务器...
start "后端服务器" cmd /k "cd backend && python main.py"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端
echo 🎨 启动前端开发服务器...
start "前端服务器" cmd /k "npm run dev"

echo.
echo ✅ 服务已启动！
echo 📱 前端地址: http://localhost:3000
echo 🔌 后端地址: http://localhost:8000
echo.
echo 关闭此窗口不会停止服务，请手动关闭后端和前端窗口

pause

