#!/bin/bash
# 配置 DeepSeek API Key 的脚本

echo "🔧 配置 DeepSeek API Key..."

# 读取用户输入的API Key
read -p "请输入您的 DeepSeek API Key: " api_key

if [ -z "$api_key" ]; then
    echo "❌ API Key 不能为空"
    exit 1
fi

# 设置环境变量（当前会话）
export DEEPSEEK_API_KEY="$api_key"

# 添加到 .env 文件
echo "DEEPSEEK_API_KEY=$api_key" > .env

echo "✅ API Key 已配置！"
echo ""
echo "💡 提示："
echo "   1. 当前会话已生效"
echo "   2. API Key 已保存到 .env 文件"
echo "   3. 下次启动时，请先运行: source .env 或使用启动脚本"
echo ""

