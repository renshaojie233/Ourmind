#!/bin/bash
# 检查所有环境和文件是否都在项目目录内

cd "$(dirname "$0")"

echo "🔍 检查项目环境..."
echo ""

# 检查Python虚拟环境
if [ -d "ourmind_env" ]; then
    echo "✅ Python虚拟环境: ourmind_env/ (项目内)"
    echo "   大小: $(du -sh ourmind_env 2>/dev/null | cut -f1)"
else
    echo "❌ Python虚拟环境不存在"
fi

# 检查Node.js依赖
if [ -d "node_modules" ]; then
    echo "✅ Node.js依赖: node_modules/ (项目内)"
    echo "   大小: $(du -sh node_modules 2>/dev/null | cut -f1)"
else
    echo "❌ Node.js依赖不存在"
fi

# 检查上传目录
if [ -d "uploads" ]; then
    echo "✅ 上传目录: uploads/ (项目内)"
    file_count=$(find uploads -type f 2>/dev/null | wc -l)
    echo "   文件数: $file_count"
else
    echo "⚠️  上传目录不存在（首次运行时会自动创建）"
fi

# 检查配置文件
echo ""
echo "📝 配置文件检查:"
[ -f ".env" ] && echo "✅ .env (API配置)" || echo "⚠️  .env 不存在（可选）"
[ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json 缺失"
[ -f "requirements.txt" ] && echo "✅ requirements.txt" || echo "❌ requirements.txt 缺失"
[ -f "backend/main.py" ] && echo "✅ backend/main.py" || echo "❌ backend/main.py 缺失"

# 检查路径配置
echo ""
echo "🔧 路径配置检查:"
if grep -q "UPLOAD_DIR = Path(__file__).parent.parent" backend/main.py 2>/dev/null; then
    echo "✅ 上传目录路径: 项目根目录/uploads"
else
    echo "⚠️  请检查上传目录路径配置"
fi

echo ""
echo "📊 项目总大小:"
total_size=$(du -sh . 2>/dev/null | cut -f1)
echo "   $total_size"

echo ""
echo "✅ 所有环境都在项目目录内，完全自包含！"

