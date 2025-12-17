# 📚 文档思维导图生成器 - 完整说明

## ✅ 项目特点

**完全自包含** - 所有文件、环境和依赖都在项目目录内，无需外部配置！

## 📁 项目结构

```
Ourmind/                    # 项目根目录（所有内容都在这里）
├── ourmind_env/            # Python虚拟环境（85MB）
│   ├── bin/               # Python可执行文件
│   └── lib/               # 所有Python依赖包
├── node_modules/           # Node.js依赖（135MB）
│   └── ...                # 所有前端依赖包
├── uploads/                # 上传文件存储（用户上传的PDF等）
├── backend/                # 后端代码
│   └── main.py            # FastAPI服务器
├── src/                    # 前端代码
│   ├── components/        # React组件
│   └── ...
├── .env                    # API密钥配置
├── package.json           # 前端依赖配置
├── requirements.txt       # 后端依赖配置
└── quick_start.sh         # 一键启动脚本
```

## 🎯 核心特性

- ✅ **全屏显示** - 无背景占用，充分利用屏幕空间
- ✅ **PDF原格式显示** - 左侧显示原PDF（保留格式、图片等）
- ✅ **AI思维导图** - 右侧显示DeepSeek AI生成的思维导图
- ✅ **完全自包含** - 所有环境都在项目目录内
- ✅ **一键启动** - 无需额外配置

## 🚀 快速开始

### 1. 检查环境

```bash
./环境检查.sh
```

### 2. 一键启动

```bash
./quick_start.sh
```

### 3. 访问应用

- 前端: http://localhost:3000
- 后端: http://localhost:8000

## 📊 项目大小

- Python虚拟环境: **85MB**
- Node.js依赖: **135MB**
- 项目代码: **<1MB**
- **总计**: **~220MB**

## 🔧 环境说明

### Python环境
- **位置**: `ourmind_env/` (项目根目录)
- **包含**: FastAPI、OpenAI、PyPDF2、python-docx等
- **激活**: `source ourmind_env/bin/activate`

### Node.js环境
- **位置**: `node_modules/` (项目根目录)
- **包含**: React、Vite、react-pdf、Tailwind CSS等

### 上传文件
- **位置**: `uploads/` (项目根目录)
- **自动创建**: 首次上传时自动创建
- **存储**: 用户上传的PDF、DOCX、TXT文件

## ⚙️ 配置说明

### API配置

编辑 `.env` 文件：

```bash
DEEPSEEK_API_KEY=sk-your-api-key-here
```

或使用配置脚本：

```bash
./config_api.sh
```

## 📝 使用流程

1. **上传文档** - 支持PDF、DOCX、TXT格式
2. **AI分析** - DeepSeek AI自动分析文档内容
3. **查看结果** - 左侧查看原PDF，右侧查看思维导图

## 🛠️ 技术栈

### 前端
- React 18
- Vite
- Tailwind CSS
- react-pdf (PDF查看器)
- Axios

### 后端
- Python FastAPI
- DeepSeek API / OpenAI API
- PyPDF2 (PDF处理)
- python-docx (Word处理)

## 🔒 安全提示

以下内容已在 `.gitignore` 中，不会提交到版本控制：
- `.env` - API密钥
- `ourmind_env/` - Python虚拟环境
- `node_modules/` - Node.js依赖
- `uploads/` - 用户上传文件
- `__pycache__/` - Python缓存

## 📦 依赖安装

所有依赖已安装完成，位于项目目录内：
- ✅ Python依赖: `ourmind_env/`
- ✅ Node.js依赖: `node_modules/`

如需重新安装：

```bash
# Python依赖
source ourmind_env/bin/activate
pip install -r requirements.txt

# Node.js依赖
npm install
```

## 🎨 界面功能

### 左侧 - PDF查看器
- 📄 显示原PDF文档（保留格式）
- 🔍 缩放功能（放大/缩小）
- 📖 翻页功能（上一页/下一页）
- 📊 显示页码和总页数

### 右侧 - 思维导图
- 🗺️ AI生成的思维导图
- 🎨 层次化可视化
- 📱 响应式设计

## 💡 提示

- 所有路径都是相对路径，确保在项目目录内运行
- 虚拟环境路径硬编码在脚本中，确保使用项目内的环境
- 上传文件存储在项目内，便于管理和备份

## 🐛 故障排除

### 检查环境
```bash
./环境检查.sh
```

### 查看日志
- 后端日志: 终端输出
- 前端日志: 浏览器控制台

### 重启服务
按 `Ctrl+C` 停止，然后重新运行 `./quick_start.sh`

## 📞 支持

如有问题，请检查：
1. Python和Node.js版本是否正确
2. API密钥是否配置
3. 端口3000和8000是否被占用

---

**✅ 项目完全自包含，所有环境都在项目目录内！**

