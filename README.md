# 📚 Ourmind - 智能文档思维导图生成器

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Node](https://img.shields.io/badge/node-16+-green.svg)

**一个基于AI的智能文档分析工具，可以上传文档（PDF、DOCX、TXT），使用大模型分析内容，并自动生成美观的思维导图。**

[功能特点](#-功能特点) • [快速开始](#-快速启动推荐) • [演示视频](#-演示视频) • [使用说明](#-使用方法)

</div>

---

## 🎬 演示视频

<div align="center">

**📹 完整功能演示视频：**

https://github.com/user-attachments/assets/Ourmind_demo.mp4

*演示视频展示了完整的上传文档、AI分析和思维导图生成流程*

**或者直接查看项目中的演示视频：** [`pic/Ourmind_demo.mp4`](pic/Ourmind_demo.mp4)

</div>

## ✨ 功能特点

- 📄 **多格式支持** - 支持 PDF、DOCX、TXT 等多种文档格式
- 🤖 **AI智能分析** - 使用 OpenAI 或 DeepSeek API 智能分析文档内容
- 🗺️ **自动生成思维导图** - 自动生成结构化的思维导图，支持中英文切换
- 🎨 **现代化UI** - 精美的用户界面，提供流畅的使用体验
- ⚡ **实时预览** - 支持文档预览和思维导图实时生成
- 🔍 **关键词高亮** - 点击思维导图节点可高亮显示文档中的相关内容
- 🌐 **公网访问** - 支持 ngrok 和 Cloudflare Tunnel 实现公网访问

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化的前端框架
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Axios** - HTTP客户端
- **react-pdf** - PDF文档渲染

### 后端
- **Python FastAPI** - 高性能的异步Web框架
- **OpenAI API / DeepSeek API** - AI大模型接口
- **PyPDF2** - PDF文档处理
- **python-docx** - Word文档处理
- **Uvicorn** - ASGI服务器

## 📦 安装和运行

### 前置要求

- **Node.js** 16+ 
- **Python** 3.8+
- **（可选）OpenAI API Key 或 DeepSeek API Key**

> 💡 **提示**：如果没有 API Key，系统会使用模拟数据演示功能，您可以先体验界面和功能。

### 🚀 快速启动（推荐）

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```bash
start.bat
```

启动后访问：
- **前端地址**: http://localhost:3000
- **后端地址**: http://localhost:8000

### 📋 手动安装步骤

#### 1. 克隆仓库
```bash
git clone https://github.com/renshaojie233/Ourmind.git
cd Ourmind
```

#### 2. 安装前端依赖
```bash
npm install
```

#### 3. 安装后端依赖
```bash
pip install -r requirements.txt
```

#### 4. 配置API密钥（可选）

创建 `.env` 文件并添加以下内容：

```bash
# 方式1：使用 DeepSeek API（推荐，性价比高）
DEEPSEEK_API_KEY=your-deepseek-api-key-here

# 方式2：使用 OpenAI API
OPENAI_API_KEY=your-openai-api-key-here
```

**注意：** 如果同时设置了两个API Key，系统会优先使用 DeepSeek API。

如果不设置API Key，系统将使用模拟数据演示功能。

#### 5. 启动后端服务器
```bash
cd backend
python main.py
```

后端将在 `http://localhost:8000` 启动

#### 6. 启动前端开发服务器

在项目根目录运行：
```bash
npm run dev
```

前端将在 `http://localhost:3000` 启动

## 📖 使用方法

### 本地访问

1. 打开浏览器访问 `http://localhost:3000`
2. 点击上传区域或拖拽文件到页面上传文档
3. 等待AI分析文档内容（通常需要几秒到几十秒）
4. 查看生成的思维导图
5. 点击思维导图中的节点，可以高亮显示文档中的相关内容
6. 使用中英文切换按钮切换思维导图语言

### 🌐 公网访问（从任何地方访问）

想要从任何地方（不限于同一WiFi）访问网站？有两种简单方案：

#### 方案一：使用 ngrok（推荐，简单快速）

1. **安装 ngrok**
   ```bash
   # 访问 https://dashboard.ngrok.com/signup 注册并获取 authtoken
   # 然后安装并配置
   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
   tar -xzf ngrok-v3-stable-linux-amd64.tgz
   sudo mv ngrok /usr/local/bin/
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

2. **启动服务**
   ```bash
   ./start_with_ngrok.sh
   ```
   启动后会显示公网URL，在任何设备上访问即可！

#### 方案二：使用 Cloudflare Tunnel（完全免费）

```bash
./start_with_cloudflare.sh
```
首次运行会要求登录Cloudflare账号（免费），之后会自动创建公网链接。

**详细说明请查看：** [`公网访问方案.md`](公网访问方案.md)

## 📁 项目结构

```
Ourmind/
├── backend/
│   └── main.py              # FastAPI后端服务器
├── src/
│   ├── components/
│   │   ├── DocumentView.jsx # 文档预览组件
│   │   ├── FileUpload.jsx  # 文件上传组件
│   │   ├── MindMap.jsx     # 思维导图展示组件
│   │   └── PDFViewer.jsx   # PDF查看器组件
│   ├── App.jsx              # 主应用组件
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── pic/
│   └── Ourmind_demo.mp4     # 演示视频
├── index.html               # HTML模板
├── package.json             # 前端依赖配置
├── requirements.txt         # 后端依赖配置
├── vite.config.js           # Vite配置
├── tailwind.config.js       # Tailwind配置
├── start.sh                 # Linux/Mac启动脚本
├── start.bat                # Windows启动脚本
├── start_with_ngrok.sh      # ngrok公网访问启动脚本
├── start_with_cloudflare.sh # Cloudflare公网访问启动脚本
├── example.txt              # 示例测试文档
└── README.md                # 项目说明文档
```

## ⚙️ 配置说明

### API配置

项目支持两种AI API：

1. **DeepSeek API**（推荐）
   - 性价比高，价格便宜
   - 与OpenAI API兼容
   - 配置方式：设置 `DEEPSEEK_API_KEY` 环境变量

2. **OpenAI API**
   - 官方API，稳定可靠
   - 配置方式：设置 `OPENAI_API_KEY` 环境变量

### 环境变量

可以在 `.env` 文件中配置，或直接使用环境变量：

```bash
# DeepSeek API（优先使用）
DEEPSEEK_API_KEY=your-api-key

# OpenAI API（备选）
OPENAI_API_KEY=your-api-key
```

## 📝 注意事项

- 如果没有设置API Key，系统会使用模拟数据演示功能
- 大文件处理可能需要较长时间，请耐心等待
- 建议文档大小不超过10MB以获得最佳体验
- PDF文件需要包含可提取的文本内容（扫描版PDF可能无法处理）
- API调用会产生费用，请注意使用量

## 🎯 使用场景

- 📖 **学习笔记整理** - 快速将教材、论文整理成思维导图
- 📊 **文档摘要** - 快速理解长文档的核心内容
- 🎓 **知识梳理** - 将复杂知识点可视化展示
- 📝 **会议记录** - 将会议文档转化为结构化思维导图
- 🔍 **内容检索** - 通过思维导图节点快速定位文档内容

## 🐛 常见问题

### Q: 为什么生成的思维导图不完整？
A: 可能是文档内容过长，AI模型有token限制。建议将文档分段处理，或使用更高级的API模型。

### Q: 支持哪些文档格式？
A: 目前支持 PDF、DOCX、TXT 格式。PDF文件需要包含可提取的文本内容（扫描版PDF可能无法处理）。

### Q: 如何提高生成质量？
A: 建议使用 DeepSeek API 或 OpenAI API，并确保文档结构清晰、内容完整。

### Q: 可以离线使用吗？
A: 目前需要联网调用AI API。如需离线版本，可以考虑使用本地部署的大模型。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

贡献指南：
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT License 许可证。详情请查看 [LICENSE](LICENSE) 文件。

## 👤 作者

- **任少杰**
- Email: rsjscu@163.com
- GitHub: [@renshaojie233](https://github.com/renshaojie233)

## 🙏 致谢

感谢以下优秀的开源项目和服务：

- [OpenAI](https://openai.com/) - 提供强大的AI能力
- [DeepSeek](https://www.deepseek.com/) - 提供高性价比的AI API
- [FastAPI](https://fastapi.tiangolo.com/) - 优秀的Python Web框架
- [React](https://react.dev/) - 强大的前端框架
- [Vite](https://vitejs.dev/) - 快速的构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架

---

<div align="center">

**⭐ 如果这个项目对你有帮助，欢迎给个 Star！**

**📧 如有问题或建议，欢迎通过 Issue 或邮件联系我。**

Made with ❤️ by [renshaojie233](https://github.com/renshaojie233)

</div>
