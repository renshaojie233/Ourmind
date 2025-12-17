#!/bin/bash
# 使用 ngrok 创建公网访问链接

cd "$(dirname "$0")"

echo "🚀 启动文档思维导图生成器（公网访问模式）..."
echo ""

# 检查 ngrok 是否存在（优先使用当前目录的）
if [ ! -f "./ngrok" ] && ! command -v ngrok &> /dev/null; then
    echo "❌ 未找到 ngrok，请先安装："
    echo ""
    echo "1. 访问 https://dashboard.ngrok.com/signup 注册账号"
    echo "2. 获取 authtoken"
    echo "3. 安装 ngrok："
    echo "   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz"
    echo "   tar -xzf ngrok-v3-stable-linux-amd64.tgz"
    echo "   sudo mv ngrok /usr/local/bin/"
    echo "4. 配置 token："
    echo "   ngrok config add-authtoken YOUR_AUTH_TOKEN"
    echo ""
    exit 1
fi

# 清理可能占用的端口
echo "🧹 清理端口..."
lsof -ti:8000 | xargs kill -9 2>/dev/null
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:4040 | xargs kill -9 2>/dev/null  # ngrok web界面端口
sleep 1

# 加载 .env 文件中的环境变量（如果存在）
if [ -f .env ]; then
    echo "📝 加载环境变量配置..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# 启动后端（使用虚拟环境）
echo "🔧 启动后端服务器..."
source ourmind_env/bin/activate
cd backend
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 启动前端
echo "🎨 启动前端开发服务器..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# 等待前端启动
sleep 3

# 启动 ngrok（优先使用当前目录的）
echo "🌐 启动 ngrok 隧道..."
if [ -f "./ngrok" ]; then
    ./ngrok http 3000 > ngrok.log 2>&1 &
else
    ngrok http 3000 > ngrok.log 2>&1 &
fi
NGROK_PID=$!

# 等待 ngrok 启动
sleep 5

# 获取公网URL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 服务已启动！"
echo ""
echo "📱 本地访问:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo ""
echo "🌐 公网访问（可在任何地方访问）:"
echo "   正在获取 ngrok 公网地址..."

# 尝试从 ngrok API 获取URL
sleep 3
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o 'https://[^"]*\.ngrok[^"]*' | head -1)

if [ -n "$NGROK_URL" ]; then
    echo "   ✅ 前端: $NGROK_URL"
    echo ""
    echo "💡 在任何设备（手机/电脑）的浏览器中访问:"
    echo "   $NGROK_URL"
    echo ""
    echo "📊 ngrok 管理界面: http://localhost:4040"
else
    echo "   ⚠️  无法自动获取URL，请查看:"
    echo "   - ngrok 管理界面: http://localhost:4040"
    echo "   - 或查看 ngrok.log 文件"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - ngrok 免费版每次启动URL会变化"
echo "   - 查看 ngrok.log 了解详细信息"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID $NGROK_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup INT TERM

# 等待进程
wait

