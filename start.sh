#!/bin/bash

echo "🚀 启动文档思维导图生成器..."

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python 3.8+"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 检查虚拟环境是否存在
if [ ! -d "ourmind_env" ]; then
    echo "📦 创建Python虚拟环境..."
    python3 -m venv ourmind_env
fi

# 激活虚拟环境并检查依赖
echo "📦 检查并安装Python依赖..."
source ourmind_env/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

# 检查前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

# 启动后端（后台运行）
echo "🔧 启动后端服务器..."
cd backend
source ../ourmind_env/bin/activate
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 检查后端是否启动成功
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ 后端启动失败，请查看 backend.log"
    exit 1
fi

# 启动前端
echo "🎨 启动前端开发服务器..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# 获取本机IP地址
get_local_ip() {
    if command -v ip &> /dev/null; then
        ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | head -1
    elif command -v ifconfig &> /dev/null; then
        ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1
    else
        hostname -I 2>/dev/null | awk '{print $1}'
    fi
}

LOCAL_IP=$(get_local_ip)

echo ""
echo "✅ 服务已启动！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 本地访问:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo ""
if [ -n "$LOCAL_IP" ]; then
    echo "🌐 其他设备访问（同一网络）:"
    echo "   前端: http://$LOCAL_IP:3000"
    echo "   后端: http://$LOCAL_IP:8000"
    echo ""
    echo "💡 在其他设备（手机/电脑）的浏览器中访问:"
    echo "   http://$LOCAL_IP:3000"
else
    echo "⚠️  无法自动获取IP地址，请手动查看:"
    echo "   Linux: ip addr show 或 ifconfig"
    echo "   Mac: ifconfig | grep 'inet '"
    echo "   Windows: ipconfig"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 日志文件:"
echo "   - 后端日志: backend.log"
echo "   - 前端日志: frontend.log"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup INT TERM

# 等待进程
wait

