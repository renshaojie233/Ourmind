#!/bin/bash
# 使用 Cloudflare Tunnel 创建公网访问链接

cd "$(dirname "$0")"

echo "🚀 启动文档思维导图生成器（Cloudflare Tunnel 公网访问模式）..."
echo ""

# 检查 cloudflared 是否安装
if ! command -v cloudflared &> /dev/null; then
    echo "❌ 未找到 cloudflared，正在安装..."
    echo ""
    
    # 检测系统类型并安装
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        ARCH=$(uname -m)
        if [ "$ARCH" = "x86_64" ]; then
            ARCH="amd64"
        elif [ "$ARCH" = "aarch64" ]; then
            ARCH="arm64"
        fi
        
        echo "📦 下载 cloudflared..."
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH} -O cloudflared
        chmod +x cloudflared
        sudo mv cloudflared /usr/local/bin/cloudflared 2>/dev/null || mv cloudflared ~/.local/bin/cloudflared 2>/dev/null
        
        if command -v cloudflared &> /dev/null; then
            echo "✅ cloudflared 安装成功"
        else
            echo "❌ 安装失败，请手动安装："
            echo "   wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${ARCH}"
            echo "   chmod +x cloudflared"
            echo "   sudo mv cloudflared /usr/local/bin/"
            exit 1
        fi
    else
        echo "请访问 https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/ 安装 cloudflared"
        exit 1
    fi
fi

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

# 启动 Cloudflare Tunnel
echo "🌐 启动 Cloudflare Tunnel..."
echo "💡 首次运行会要求登录 Cloudflare 账号（免费）"
echo ""

cloudflared tunnel --url http://localhost:3000 > cloudflare.log 2>&1 &
CLOUDFLARE_PID=$!

# 等待 tunnel 启动
sleep 5

# 从日志中提取URL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 服务已启动！"
echo ""
echo "📱 本地访问:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8000"
echo ""
echo "🌐 公网访问（可在任何地方访问）:"

# 尝试从日志中提取URL
sleep 3
CLOUDFLARE_URL=$(grep -o 'https://[^[:space:]]*\.trycloudflare\.com' cloudflare.log 2>/dev/null | head -1)

if [ -n "$CLOUDFLARE_URL" ]; then
    echo "   ✅ 前端: $CLOUDFLARE_URL"
    echo ""
    echo "💡 在任何设备（手机/电脑）的浏览器中访问:"
    echo "   $CLOUDFLARE_URL"
else
    echo "   ⚠️  正在获取URL，请稍候..."
    echo "   💡 查看 cloudflare.log 文件获取完整URL"
    echo "   💡 或等待几秒后URL会自动显示"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - Cloudflare Tunnel 完全免费，无流量限制"
echo "   - 每次启动URL会变化（可以配置固定域名）"
echo ""

# 清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."
    kill $BACKEND_PID $FRONTEND_PID $CLOUDFLARE_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID $CLOUDFLARE_PID 2>/dev/null
    echo "✅ 服务已停止"
    exit 0
}

# 捕获中断信号
trap cleanup INT TERM

# 等待进程
wait






