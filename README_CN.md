# 文档思维导图生成器 - 快速开始

## 🚀 一键启动

所有依赖已安装完成！现在您可以使用以下命令一键启动：

```bash
./quick_start.sh
```

或者使用完整版启动脚本（带日志）：

```bash
./start.sh
```

## 📋 启动后

- **前端地址**: http://localhost:3000
- **后端地址**: http://localhost:8000

## 🛑 停止服务

按 `Ctrl+C` 即可停止所有服务

## 📝 环境信息

- **Python虚拟环境**: `ourmind_env/`
- **Python版本**: 3.8.10
- **Node.js版本**: v24.11.1
- **所有依赖**: 已安装完成 ✅

## 🔧 手动启动（如果需要）

### 启动后端
```bash
source ourmind_env/bin/activate
cd backend
python main.py
```

### 启动前端（新终端）
```bash
npm run dev
```

## 💡 使用提示

1. 打开浏览器访问 http://localhost:3000
2. 上传文档（支持 PDF、DOCX、TXT）
3. 等待AI分析并生成思维导图
4. 查看结果！

## ⚙️ 配置OpenAI API（可选）

如果需要使用真实的AI分析功能：

```bash
export OPENAI_API_KEY="your-api-key-here"
```

不设置API Key时，系统会使用模拟数据演示功能。

