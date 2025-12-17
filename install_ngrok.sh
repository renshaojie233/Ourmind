#!/bin/bash
# ngrok 安装脚本 - 安装到当前目录

cd "$(dirname "$0")"

echo "📦 正在下载 ngrok..."

# 尝试多种下载方式
if command -v wget &> /dev/null; then
    # 方法1: 使用官方下载链接
    wget -q --show-progress https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip -O ngrok.zip 2>&1
    
    if [ -f ngrok.zip ] && [ -s ngrok.zip ]; then
        echo "✅ 下载成功，正在解压..."
        unzip -q ngrok.zip
        chmod +x ngrok
        rm ngrok.zip
        echo "✅ ngrok 安装完成！"
        exit 0
    fi
fi

# 方法2: 使用curl
echo "尝试使用 curl 下载..."
curl -L https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip -o ngrok.zip

if [ -f ngrok.zip ] && [ -s ngrok.zip ]; then
    echo "✅ 下载成功，正在解压..."
    unzip -q ngrok.zip
    chmod +x ngrok
    rm ngrok.zip
    echo "✅ ngrok 安装完成！"
    exit 0
fi

echo "❌ 自动下载失败，请手动下载："
echo "1. 访问 https://ngrok.com/download"
echo "2. 下载 Linux 版本"
echo "3. 解压到当前目录"
echo "4. 运行: chmod +x ngrok"






