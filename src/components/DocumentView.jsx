import React, { useEffect, useRef } from 'react'
import PDFViewer from './PDFViewer'

function DocumentView({ fileUrl, fileType, text, filename, highlightKeywords = [] }) {
  const textContainerRef = useRef(null)

  // 如果是PDF，使用PDF查看器
  if (fileType === '.pdf' && fileUrl) {
    return <PDFViewer fileUrl={fileUrl} filename={filename} highlightKeywords={highlightKeywords} />
  }

  // 其他文件类型显示文本
  if (!text) {
    return (
      <div className="h-full flex items-center justify-center text-amber-700/60 bg-amber-50/30 paper-texture">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg">文档内容将显示在这里</p>
          <p className="text-sm mt-2 text-amber-600/60">上传文档后，原文档将显示在左侧</p>
        </div>
      </div>
    )
  }

  // 高亮文本的函数
  const highlightText = (text, keywords) => {
    if (!keywords || keywords.length === 0 || !text) {
      return text
    }

    console.log('🔍 文本高亮关键词:', keywords)

    // 创建正则表达式来匹配所有关键词（更宽松的匹配）
    const escapedKeywords = keywords.map(kw =>
      kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )

    // 尝试多种匹配模式
    let regex
    try {
      // 模式1: 精确匹配整个关键词
      regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi')
    } catch (e) {
      console.error('正则表达式创建失败:', e)
      return text
    }

    // 分割文本并高亮匹配部分
    const parts = text.split(regex)
    let matchCount = 0

    return parts.map((part, index) => {
      // 更宽松的匹配检查
      const isMatch = keywords.some(kw => {
        const cleanKw = kw.toLowerCase().trim()
        const cleanPart = part.toLowerCase().trim()
        return cleanPart === cleanKw || cleanPart.includes(cleanKw) || cleanKw.includes(cleanPart)
      })

      if (isMatch && part.trim().length > 0) {
        matchCount++
        console.log(`✅ 匹配到关键词: "${part}"`)
        return (
          <mark
            key={index}
            className="font-semibold px-1 rounded"
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.3)', // 棕色高亮
              boxShadow: '0 0 0 2px rgba(180, 83, 9, 0.4)',
              transition: 'all 0.3s ease',
              animation: matchCount === 1 ? 'highlight-pulse 1.5s ease-in-out 2' : 'none',
              color: '#78350f'
            }}
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }

  // 当关键词变化时，滚动到第一个匹配位置
  useEffect(() => {
    if (highlightKeywords.length > 0 && textContainerRef.current) {
      const firstMark = textContainerRef.current.querySelector('mark')
      if (firstMark) {
        firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [highlightKeywords])

  return (
    <div className="h-full flex flex-col bg-amber-50/50 overflow-hidden paper-texture">
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-6 py-4 text-amber-50 shadow-md border-b-2 border-amber-950/30 ink-blur">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📄</span>
          <span>{filename || '原文档'}</span>
          {highlightKeywords.length > 0 && (
            <span className="text-sm opacity-90 ml-2">
              (已高亮 {highlightKeywords.length} 个关键词)
            </span>
          )}
        </h3>
      </div>
      <div ref={textContainerRef} className="flex-1 overflow-auto p-6 bg-amber-50/30">
        <div className="max-w-none">
          <pre className="whitespace-pre-wrap font-serif text-amber-900 leading-relaxed text-sm bg-amber-50/90 p-4 rounded-lg border-2 border-amber-200/60 shadow-md paper-texture">
            {highlightText(text, highlightKeywords)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default DocumentView

