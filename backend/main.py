from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from starlette.staticfiles import StaticFiles
import os
from openai import OpenAI
from docx import Document
import PyPDF2
import io
import json
import base64
import tempfile
import uuid
import re
from pathlib import Path
from typing import Optional

# 加载 .env 文件
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()

app = FastAPI(title="文档思维导图生成器")

# 创建临时文件目录
UPLOAD_DIR = Path(__file__).parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# 配置CORS - 允许所有来源（用于局域网访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，方便其他设备访问
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 静态文件服务
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# 配置AI API（支持OpenAI和DeepSeek）
# 优先使用DEEPSEEK_API_KEY，如果没有则使用OPENAI_API_KEY
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

client = None
api_provider = None

if DEEPSEEK_API_KEY:
    # 使用DeepSeek API
    client = OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com"
    )
    api_provider = "deepseek"
    print("✅ 已配置 DeepSeek API")
elif OPENAI_API_KEY:
    # 使用OpenAI API
    client = OpenAI(api_key=OPENAI_API_KEY)
    api_provider = "openai"
    print("✅ 已配置 OpenAI API")
else:
    print("⚠️  未配置API Key，将使用模拟数据")

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """从文件中提取文本内容"""
    if filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    elif filename.endswith('.docx'):
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    elif filename.endswith('.txt'):
        return file_content.decode('utf-8')
    else:
        raise ValueError(f"不支持的文件类型: {filename}")

def generate_mindmap_with_llm(text: str) -> dict:
    """使用大模型生成思维导图结构（中英文版本）"""
    prompt = f"""请分析以下文档内容，生成一个结构化的思维导图。

重要要求：
1. 每个节点的名称必须简洁，中文不超过8个字，英文不超过4个单词
2. 子节点名称要更加精炼，中文不超过6个字，英文不超过3个单词
3. 避免使用长句子或描述性文字，只使用关键词或短语
4. 需要生成中英文两个版本
5. **关键**：每个节点必须包含 "keywords" 字段，这非常重要！

关于 keywords 字段的要求：
- keywords 必须是从原文中**直接复制**的词语或短语
- 每个关键词应该是原文中实际存在的、连续的文本片段
- 选择最具代表性的2-5个关键词
- 关键词应该能在原文中被精确找到
- 例如：如果原文有"机器学习算法"，就用"机器学习"或"算法"作为关键词
- 不要创造新词，必须使用原文中的原话

思维导图应该以JSON格式返回，格式如下：
{{
  "chinese": {{
    "name": "文档主题",
    "keywords": ["原文中的词1", "原文中的词2"],
    "children": [
      {{
        "name": "章节1",
        "keywords": ["原文中的关键句"],
        "children": [
          {{"name": "要点1", "keywords": ["原文中的词"]}},
          {{"name": "要点2", "keywords": ["原文中的词"]}}
        ]
      }},
      {{
        "name": "章节2",
        "keywords": ["原文关键词"],
        "children": [
          {{"name": "要点3", "keywords": ["原文词语"]}}
        ]
      }}
    ]
  }},
  "english": {{
    "name": "Topic",
    "keywords": ["word from text", "phrase from text"],
    "children": [
      {{
        "name": "Chapter 1",
        "keywords": ["exact text"],
        "children": [
          {{"name": "Point 1", "keywords": ["from original"]}},
          {{"name": "Point 2", "keywords": ["from text"]}}
        ]
      }},
      {{
        "name": "Chapter 2",
        "keywords": ["original word"],
        "children": [
          {{"name": "Point 3", "keywords": ["text snippet"]}}
        ]
      }}
    ]
  }}
}}

文档内容：
{text[:3000]}

请只返回JSON格式的思维导图数据，包含chinese和english两个字段。
**重要**：keywords 必须是从上面的文档内容中直接提取的原文片段，这样才能在原文中高亮显示！"""

    try:
        if client:
            # 根据API提供商选择模型
            if api_provider == "deepseek":
                model = "deepseek-chat"
            else:
                model = "gpt-3.5-turbo"
            
            print(f"📤 正在调用 {api_provider} API (模型: {model})...")
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "你是一个专业的文档分析助手，擅长将文档内容组织成思维导图结构。请确保返回的JSON格式正确且完整，必须包含chinese和english两个字段。"},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=3000  # 增加token限制以确保完整返回
            )
            result = response.choices[0].message.content.strip()
            print(f"📥 AI原始返回 (前1000字符): {result[:1000]}...")
            print(f"📥 AI原始返回长度: {len(result)} 字符")
            
            # 尝试提取JSON
            if "```json" in result:
                result = result.split("```json")[1].split("```")[0].strip()
            elif "```" in result:
                result = result.split("```")[1].split("```")[0].strip()
            
            # 尝试找到JSON对象（可能包含在文本中）
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                result = json_match.group(0)
            
            # 尝试解析JSON
            try:
                parsed = json.loads(result)
                print(f"✅ JSON解析成功")
                return parsed
            except json.JSONDecodeError as e:
                print(f"❌ JSON解析失败: {e}")
                print(f"尝试解析的内容: {result[:200]}...")
                # 如果JSON解析失败，尝试修复常见问题
                try:
                    # 替换单引号为双引号（但要小心字符串中的单引号）
                    result = result.replace("'", '"')
                    parsed = json.loads(result)
                    print(f"✅ 修复后JSON解析成功")
                    return parsed
                except:
                    print(f"❌ 修复后仍然失败，使用默认结构")
                    # 返回默认结构
                    return {
                        "chinese": {
                            "name": "文档分析结果",
                            "children": [
                                {"name": "JSON解析失败，请检查AI返回格式"}
                            ]
                        },
                        "english": {
                            "name": "Document Analysis Result",
                            "children": [
                                {"name": "JSON parsing failed, please check AI response format"}
                            ]
                        }
                    }
        else:
            # 模拟响应（用于演示）- 包含中英文版本和keywords
            # 从文本中提取一些关键词作为示例
            text_sample = text[:500] if text else ""
            return {
                "chinese": {
                    "name": "文档分析结果",
                    "keywords": text_sample.split()[:3],
                    "children": [
                        {
                            "name": "第一章：概述",
                            "keywords": text_sample.split()[3:6] if len(text_sample.split()) > 6 else ["概述"],
                            "children": [
                                {"name": "背景介绍", "keywords": text_sample.split()[6:9] if len(text_sample.split()) > 9 else ["背景"]},
                                {"name": "目标设定", "keywords": text_sample.split()[9:12] if len(text_sample.split()) > 12 else ["目标"]}
                            ]
                        },
                        {
                            "name": "第二章：主要内容",
                            "keywords": text_sample.split()[12:15] if len(text_sample.split()) > 15 else ["内容"],
                            "children": [
                                {"name": "核心概念", "keywords": text_sample.split()[15:18] if len(text_sample.split()) > 18 else ["概念"]},
                                {"name": "实施方法", "keywords": text_sample.split()[18:21] if len(text_sample.split()) > 21 else ["方法"]}
                            ]
                        },
                        {
                            "name": "第三章：总结",
                            "keywords": text_sample.split()[21:24] if len(text_sample.split()) > 24 else ["总结"],
                            "children": [
                                {"name": "关键要点", "keywords": text_sample.split()[24:27] if len(text_sample.split()) > 27 else ["要点"]},
                                {"name": "未来展望", "keywords": text_sample.split()[27:30] if len(text_sample.split()) > 30 else ["展望"]}
                            ]
                        }
                    ]
                },
                "english": {
                    "name": "Document Analysis Result",
                    "keywords": text_sample.split()[:3],
                    "children": [
                        {
                            "name": "Chapter 1: Overview",
                            "keywords": text_sample.split()[3:6] if len(text_sample.split()) > 6 else ["overview"],
                            "children": [
                                {"name": "Background", "keywords": text_sample.split()[6:9] if len(text_sample.split()) > 9 else ["background"]},
                                {"name": "Objectives", "keywords": text_sample.split()[9:12] if len(text_sample.split()) > 12 else ["objectives"]}
                            ]
                        },
                        {
                            "name": "Chapter 2: Main Content",
                            "keywords": text_sample.split()[12:15] if len(text_sample.split()) > 15 else ["content"],
                            "children": [
                                {"name": "Core Concepts", "keywords": text_sample.split()[15:18] if len(text_sample.split()) > 18 else ["concepts"]},
                                {"name": "Implementation Methods", "keywords": text_sample.split()[18:21] if len(text_sample.split()) > 21 else ["methods"]}
                            ]
                        },
                        {
                            "name": "Chapter 3: Summary",
                            "keywords": text_sample.split()[21:24] if len(text_sample.split()) > 24 else ["summary"],
                            "children": [
                                {"name": "Key Points", "keywords": text_sample.split()[24:27] if len(text_sample.split()) > 27 else ["points"]},
                                {"name": "Future Outlook", "keywords": text_sample.split()[27:30] if len(text_sample.split()) > 30 else ["outlook"]}
                            ]
                        }
                    ]
                }
            }
    except Exception as e:
        # 如果API调用失败，记录错误并返回一个基于文本的简单结构
        print(f"❌ API调用出错: {str(e)}")
        import traceback
        traceback.print_exc()
        # 返回一个基于文本的简单结构（中英文版本）
        lines = [line.strip() for line in text.split('\n') if line.strip()][:20]
        return {
            "chinese": {
                "name": "文档内容",
                "children": [{"name": line} for line in lines[:10]]
            },
            "english": {
                "name": "Document Content",
                "children": [{"name": line} for line in lines[:10]]
            }
        }

@app.get("/")
async def root():
    return {"message": "文档思维导图生成器API"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """上传文档并生成思维导图"""
    try:
        # 读取文件内容
        contents = await file.read()
        
        # 保存原始文件（用于PDF显示）
        file_id = str(uuid.uuid4())
        file_ext = Path(file.filename).suffix
        saved_file_path = UPLOAD_DIR / f"{file_id}{file_ext}"
        
        with open(saved_file_path, "wb") as f:
            f.write(contents)
        
        # 提取文本
        text = extract_text_from_file(contents, file.filename)
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="文件内容为空或无法提取文本")
        
        # 使用大模型生成思维导图
        print(f"🤖 开始调用AI生成思维导图...")
        print(f"📝 文档文本长度: {len(text)} 字符")
        mindmap_data = generate_mindmap_with_llm(text)
        
        # 调试：打印生成的思维导图数据
        print(f"📊 生成的思维导图数据类型: {type(mindmap_data)}")
        print(f"📊 生成的思维导图数据: {json.dumps(mindmap_data, ensure_ascii=False, indent=2)[:1000]}...")
        
        # 检查数据格式，确保有chinese或english字段，或者有name字段（兼容旧格式）
        if not isinstance(mindmap_data, dict):
            print(f"⚠️  思维导图数据格式错误: {type(mindmap_data)}")
            # 如果数据格式不对，创建一个默认结构
            mindmap_data = {
                "chinese": {
                    "name": "文档分析结果",
                    "children": [{"name": "数据格式错误，请检查AI返回结果"}]
                },
                "english": {
                    "name": "Document Analysis Result",
                    "children": [{"name": "Data format error, please check AI response"}]
                }
            }
        elif "chinese" not in mindmap_data and "english" not in mindmap_data:
            # 如果是旧格式（直接有name和children），转换为新格式
            print("⚠️  检测到旧格式数据，转换为新格式")
            print(f"⚠️  旧格式数据内容: {json.dumps(mindmap_data, ensure_ascii=False, indent=2)[:500]}")
            if "name" in mindmap_data and "children" in mindmap_data:
                mindmap_data = {
                    "chinese": mindmap_data,
                    "english": mindmap_data  # 暂时使用相同数据
                }
            else:
                print(f"⚠️  数据格式不完整，缺少name或children字段")
                print(f"⚠️  可用字段: {list(mindmap_data.keys())}")
                # 创建一个有效的默认结构
                mindmap_data = {
                    "chinese": {
                        "name": "文档分析结果",
                        "children": [
                            {"name": "数据格式不完整"},
                            {"name": f"可用字段: {list(mindmap_data.keys())}"}
                        ]
                    },
                    "english": {
                        "name": "Document Analysis Result",
                        "children": [
                            {"name": "Incomplete data format"},
                            {"name": f"Available fields: {list(mindmap_data.keys())}"}
                        ]
                    }
                }
        
        # 最终验证：确保chinese和english都有name字段
        if "chinese" in mindmap_data:
            if not isinstance(mindmap_data["chinese"], dict) or "name" not in mindmap_data["chinese"]:
                print(f"⚠️  chinese数据格式错误: {mindmap_data.get('chinese', {})}")
                mindmap_data["chinese"] = {
                    "name": "文档分析结果",
                    "children": [{"name": "数据格式错误"}]
                }
        if "english" in mindmap_data:
            if not isinstance(mindmap_data["english"], dict) or "name" not in mindmap_data["english"]:
                print(f"⚠️  english数据格式错误: {mindmap_data.get('english', {})}")
                mindmap_data["english"] = {
                    "name": "Document Analysis Result",
                    "children": [{"name": "Data format error"}]
                }
        
        # 返回文件URL（用于前端访问）
        file_url = f"/uploads/{file_id}{file_ext}"
        
        return JSONResponse(content={
            "success": True,
            "filename": file.filename,
            "file_id": file_id,
            "file_url": file_url,
            "file_type": file_ext.lower(),
            "full_text": text,  # 返回完整文本（用于非PDF文件）
            "text_preview": text[:500] + "..." if len(text) > 500 else text,
            "mindmap": mindmap_data
        })
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理文件时出错: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

