#!/usr/bin/env python3
"""测试 DeepSeek API 配置"""

import os
import sys
from pathlib import Path

# 添加项目路径
sys.path.insert(0, str(Path(__file__).parent))

# 加载 .env 文件
env_path = Path(__file__).parent / '.env'
if env_path.exists():
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()

# 检查配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

print("=" * 50)
print("API 配置检查")
print("=" * 50)
print(f"DeepSeek API Key: {'已设置' if DEEPSEEK_API_KEY else '未设置'}")
if DEEPSEEK_API_KEY:
    print(f"  Key 前缀: {DEEPSEEK_API_KEY[:10]}...")
print(f"OpenAI API Key: {'已设置' if OPENAI_API_KEY else '未设置'}")
print()

if DEEPSEEK_API_KEY:
    print("✅ 将使用 DeepSeek API")
    print("   端点: https://api.deepseek.com")
    print("   模型: deepseek-chat")
elif OPENAI_API_KEY:
    print("✅ 将使用 OpenAI API")
    print("   模型: gpt-3.5-turbo")
else:
    print("⚠️  未配置 API Key，将使用模拟数据")
print("=" * 50)

