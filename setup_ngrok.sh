#!/bin/bash
# 配置 ngrok authtoken

cd "$(dirname "$0")"

AUTHTOKEN="361dahWGe8oaPER5fVcDeVwicnm_7GH7hTRCbCbKk7HKdJJt"

echo "🔧 配置 ngrok authtoken..."

# 检查 ngrok 是否存在
if [ ! -f "./ngrok" ]; then
    echo "❌ 未找到 ngrok 文件"
    echo ""
    echo "请先下载 ngrok："
    echo "1. 访问 https://ngrok.com/download"
    echo "2. 下载 Linux 版本到当前目录"
    echo "3. 运行: chmod +x ngrok"
    echo ""
    echo "或者运行以下命令下载："
    echo "  wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip"
    echo "  unzip ngrok-stable-linux-amd64.zip"
    echo "  chmod +x ngrok"
    exit 1
fi

# 配置 authtoken
echo "📝 配置 authtoken: $AUTHTOKEN"
./ngrok config add-authtoken "$AUTHTOKEN"

if [ $? -eq 0 ]; then
    echo "✅ authtoken 配置成功！"
    echo ""
    echo "验证配置："
    ./ngrok version
    echo ""
    echo "🎉 配置完成！现在可以运行 ./start_with_ngrok.sh 启动服务了"
else
    echo "❌ 配置失败，请检查错误信息"
    exit 1
fi






