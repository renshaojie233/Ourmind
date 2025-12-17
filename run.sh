#!/bin/bash

# 一键启动脚本 - 简化版
cd "$(dirname "$0")"

# 激活虚拟环境并启动
if [ -d "ourmind_env" ]; then
    source ourmind_env/bin/activate
    cd backend
    python main.py &
    BACKEND_PID=$!
    cd ..
    sleep 2
    npm run dev &
    FRONTEND_PID=$!
    
    echo "✅ 服务已启动！"
    echo "📱 前端: http://localhost:3000"
    echo "🔌 后端: http://localhost:8000"
    echo ""
    echo "按 Ctrl+C 停止服务"
    
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
    wait
else
    echo "❌ 虚拟环境不存在，请先运行 ./start.sh 进行初始化"
    exit 1
fi

