#!/bin/bash
# 一键启动脚本 - 最简单版本

cd "$(dirname "$0")"

echo "🚀 正在启动文档思维导图生成器..."

# 清理可能占用的端口
echo "🧹 清理端口..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1

# 加载 .env 文件中的环境变量（如果存在）
if [ -f .env ]; then
    echo "📝 加载环境变量配置..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# 获取本机IP地址
get_local_ip() {
    # 尝试多种方法获取IP地址
    if command -v ip &> /dev/null; then
        ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | head -1
    elif command -v ifconfig &> /dev/null; then
        ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1
    else
        hostname -I 2>/dev/null | awk '{print $1}'
    fi
}

LOCAL_IP=$(get_local_ip)

# 启动后端（使用虚拟环境）
source ourmind_env/bin/activate
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
npm run dev &
FRONTEND_PID=$!

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
echo "💡 提示: 按 Ctrl+C 停止所有服务"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    deactivate 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

trap cleanup INT TERM

# 等待
wait

