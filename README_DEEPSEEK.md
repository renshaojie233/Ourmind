# DeepSeek API 配置说明

## ✅ 已配置 DeepSeek API

您的 DeepSeek API Key 已配置完成！

## 🚀 使用方法

直接运行启动脚本即可：

```bash
./quick_start.sh
```

## 📝 配置信息

- **API 提供商**: DeepSeek
- **API 端点**: https://api.deepseek.com
- **模型**: deepseek-chat
- **配置文件**: `.env`

## 🔧 如何修改 API Key

### 方法1：直接编辑 .env 文件

```bash
nano .env
# 或
vim .env
```

修改 `DEEPSEEK_API_KEY` 的值。

### 方法2：使用配置脚本

```bash
./config_api.sh
```

### 方法3：设置环境变量

```bash
export DEEPSEEK_API_KEY="your-new-api-key"
```

## 💡 提示

- DeepSeek API 与 OpenAI API 兼容，使用相同的接口
- 如果同时设置了 `DEEPSEEK_API_KEY` 和 `OPENAI_API_KEY`，优先使用 DeepSeek
- API Key 保存在 `.env` 文件中，请勿提交到版本控制系统

## 🧪 测试配置

运行测试脚本验证配置：

```bash
source ourmind_env/bin/activate
python test_api.py
```

