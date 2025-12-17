import React, { useState } from 'react'
import axios from 'axios'
import MindMap from './components/MindMap'
import FileUpload from './components/FileUpload'
import DocumentView from './components/DocumentView'

function App() {
  const [mindmapData, setMindmapData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fullText, setFullText] = useState('')
  const [filename, setFilename] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [fileType, setFileType] = useState('')
  const [language, setLanguage] = useState('chinese') // 语言切换：'chinese' 或 'english'
  const [selectedKeywords, setSelectedKeywords] = useState([]) // 选中节点的关键词

  const handleFileUpload = async (file) => {
    setLoading(true)
    setError(null)
    setMindmapData(null)
    setFullText('')
    setFilename('')
    setFileUrl('')
    setFileType('')
    setSelectedKeywords([])

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        console.log('Received mindmap data:', response.data.mindmap)
        setMindmapData(response.data.mindmap)
        setFullText(response.data.full_text || response.data.text_preview || '')
        setFilename(response.data.filename || '')
        setFileUrl(response.data.file_url || '')
        setFileType(response.data.file_type || '')
      }
    } catch (err) {
      setError(err.response?.data?.detail || '上传文件时出错，请重试')
      console.error('Error uploading file:', err)
    } finally {
      setLoading(false)
    }
  }

  // 处理节点点击事件
  const handleNodeClick = (keywords) => {
    console.log('🎯 节点被点击，关键词:', keywords)
    console.log('📝 文档类型:', fileType)
    console.log('📄 文档URL:', fileUrl)
    setSelectedKeywords(keywords || [])
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden paper-texture">
      {/* 顶部标题栏 */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-amber-50 px-6 py-3 shadow-lg flex-shrink-0 border-b-2 border-amber-950/30 ink-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">📚 文档思维导图生成器</h1>
          <div className="text-sm opacity-90">上传文档，AI自动生成思维导图</div>
        </div>
      </div>

      {/* 上传区域 */}
      {!fileUrl && !mindmapData && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="bg-amber-50/90 rounded-lg shadow-xl p-6 border-2 border-amber-200/50 paper-texture ink-blur">
              <FileUpload onFileUpload={handleFileUpload} loading={loading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-100/80 border-2 border-red-300 text-red-800 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (fileUrl || mindmapData) && (
        <div className="px-6 py-2 bg-red-100/80 border-b-2 border-red-300 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* 左右分栏：文档和思维导图 */}
      {(fileUrl || fullText || mindmapData) && (
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧：原文档 */}
          <div className="flex-1 border-r-2 border-amber-300/50 overflow-hidden">
            <DocumentView
              fileUrl={fileUrl}
              fileType={fileType}
              text={fullText}
              filename={filename}
              highlightKeywords={selectedKeywords}
            />
          </div>

          {/* 右侧：思维导图 */}
          <div className="flex-1 flex flex-col overflow-hidden bg-amber-50/50">
            <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-6 py-3 text-amber-50 shadow-md flex-shrink-0 flex items-center justify-between border-b-2 border-amber-950/30 ink-blur">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <span>🗺️</span>
                <span>生成的思维导图</span>
              </h2>
              {mindmapData && (mindmapData.chinese || mindmapData.english) && (
                <div className="flex items-center gap-2 bg-amber-900/30 rounded-lg p-1 border border-amber-700/30">
                  <button
                    onClick={() => setLanguage('chinese')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                      language === 'chinese'
                        ? 'bg-amber-50 text-amber-900 shadow-md'
                        : 'text-amber-100/80 hover:text-amber-50 hover:bg-amber-900/20'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => setLanguage('english')}
                    className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                      language === 'english'
                        ? 'bg-amber-50 text-amber-900 shadow-md'
                        : 'text-amber-100/80 hover:text-amber-50 hover:bg-amber-900/20'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-auto min-h-0">
              {mindmapData ? (
                <MindMap
                  data={
                    (mindmapData.chinese && mindmapData.english)
                      ? (mindmapData[language] || mindmapData.chinese) // 如果选择的语言不存在，使用中文
                      : mindmapData // 兼容旧格式（直接有name和children）
                  }
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-amber-700/60 bg-amber-50/30">
                  <div className="text-center">
                    <div className="text-5xl mb-4 animate-pulse">⏳</div>
                    <p className="text-lg">正在生成思维导图...</p>
                    <p className="text-sm mt-2 text-amber-600/60">AI正在分析文档内容</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App



