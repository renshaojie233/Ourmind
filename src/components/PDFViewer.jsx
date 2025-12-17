import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// 配置PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

function PDFViewer({ fileUrl, filename, highlightKeywords = [] }) {
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1.0)
  const [searchText, setSearchText] = useState('')
  const pdfContainerRef = React.useRef(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  function zoomIn() {
    setScale(scale + 0.2)
  }

  function zoomOut() {
    setScale(Math.max(0.5, scale - 0.2))
  }

  // 清理文本，用于更好的匹配
  const cleanText = (text) => {
    return text
      .toLowerCase()
      .replace(/[\s\n\r\t]+/g, ' ')  // 统一空白字符
      .replace(/[^\w\u4e00-\u9fa5\s]/g, '')  // 移除标点符号
      .trim()
  }

  // 当关键词变化时，使用CSS高亮PDF中的文本
  React.useEffect(() => {
    if (highlightKeywords.length > 0 && pdfContainerRef.current) {
      console.log('🔍 尝试高亮关键词:', highlightKeywords)

      // 等待PDF文本层渲染完成
      setTimeout(() => {
        const textLayers = pdfContainerRef.current.querySelectorAll('.react-pdf__Page__textContent')
        let foundMatches = 0
        let firstMatchElement = null

        textLayers.forEach((textLayer, layerIndex) => {
          const spans = textLayer.querySelectorAll('span')

          // 获取整个文本层的完整文本（用于上下文匹配）
          const fullText = Array.from(spans).map(s => s.textContent).join(' ')
          const cleanedFullText = cleanText(fullText)

          console.log(`📄 页面 ${layerIndex + 1} 文本预览:`, fullText.substring(0, 100))

          spans.forEach(span => {
            const originalText = span.textContent
            const cleanedSpanText = cleanText(originalText)

            // 多种匹配策略
            let hasMatch = false
            let matchedKeyword = ''

            for (const kw of highlightKeywords) {
              const cleanedKw = cleanText(kw)

              // 策略1: 精确匹配
              if (cleanedSpanText.includes(cleanedKw)) {
                hasMatch = true
                matchedKeyword = kw
                break
              }

              // 策略2: 部分匹配（关键词的每个字都出现）
              const kwChars = cleanedKw.split('').filter(c => c.trim())
              if (kwChars.length > 0 && kwChars.every(char => cleanedSpanText.includes(char))) {
                hasMatch = true
                matchedKeyword = kw
                break
              }

              // 策略3: 模糊匹配（关键词在完整文本中出现，且当前span在附近）
              if (cleanedFullText.includes(cleanedKw) && originalText.length > 1) {
                const kwIndex = cleanedFullText.indexOf(cleanedKw)
                const spanIndex = cleanedFullText.indexOf(cleanedSpanText)
                // 如果span在关键词附近（前后50字符内）
                if (spanIndex >= 0 && Math.abs(kwIndex - spanIndex) < 50) {
                  hasMatch = true
                  matchedKeyword = kw
                  break
                }
              }
            }

            if (hasMatch) {
              foundMatches++
              console.log(`✅ 匹配到关键词 "${matchedKeyword}" 在文本: "${originalText}"`)

              // 棕色高亮
              span.style.backgroundColor = 'rgba(217, 119, 6, 0.3)' // 棕色高亮
              span.style.fontWeight = 'bold'
              span.style.padding = '2px 4px'
              span.style.borderRadius = '3px'
              span.style.boxShadow = '0 0 0 2px rgba(180, 83, 9, 0.4)' // 外发光
              span.style.transition = 'all 0.3s ease'
              span.style.color = '#78350f'

              // 记录第一个匹配元素
              if (!firstMatchElement) {
                firstMatchElement = span
              }
            } else {
              // 清除之前的高亮
              span.style.backgroundColor = ''
              span.style.fontWeight = ''
              span.style.padding = ''
              span.style.borderRadius = ''
              span.style.boxShadow = ''
            }
          })
        })

        console.log(`📊 总共找到 ${foundMatches} 个匹配`)

        // 滚动到第一个匹配项
        if (firstMatchElement) {
          console.log('🎯 滚动到第一个匹配位置')
          firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

          // 添加脉冲动画提示
          firstMatchElement.style.animation = 'highlight-pulse 1.5s ease-in-out 2'
        } else {
          console.warn('⚠️ 未找到任何匹配，尝试的关键词:', highlightKeywords)
        }
      }, 1000) // 增加等待时间确保PDF完全渲染
    } else if (pdfContainerRef.current) {
      // 清除所有高亮
      const spans = pdfContainerRef.current.querySelectorAll('.react-pdf__Page__textContent span')
      spans.forEach(span => {
        span.style.backgroundColor = ''
        span.style.fontWeight = ''
        span.style.padding = ''
        span.style.borderRadius = ''
        span.style.boxShadow = ''
        span.style.animation = ''
      })
    }
  }, [highlightKeywords])

  if (!fileUrl) {
    return (
      <div className="h-full flex items-center justify-center text-amber-700/60 bg-amber-50/30 paper-texture">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg">PDF文档将显示在这里</p>
          <p className="text-sm mt-2 text-amber-600/60">上传PDF文档后，原文档将显示在左侧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-amber-50/50 overflow-hidden paper-texture">
      {/* 工具栏 */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-4 py-3 text-amber-50 shadow-md flex-shrink-0 flex items-center justify-between border-b-2 border-amber-950/30 ink-blur">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <span>📄</span>
          <span className="truncate max-w-xs">{filename || '原文档'}</span>
          {numPages && (
            <span className="text-sm opacity-90 ml-2">({numPages} 页)</span>
          )}
          {highlightKeywords.length > 0 && (
            <span className="text-sm opacity-90 ml-2">
              (已高亮 {highlightKeywords.length} 个关键词)
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="px-3 py-1 bg-amber-900/30 hover:bg-amber-900/40 rounded text-sm transition border border-amber-700/30"
            title="缩小"
          >
            −
          </button>
          <span className="text-sm px-2 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="px-3 py-1 bg-amber-900/30 hover:bg-amber-900/40 rounded text-sm transition border border-amber-700/30"
            title="放大"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF内容区域 - 可滚动查看所有页面 */}
      <div ref={pdfContainerRef} className="flex-1 overflow-auto bg-amber-50/30">
        <div className="flex flex-col items-center py-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mx-auto mb-4"></div>
                  <p className="text-amber-800">加载PDF中...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-red-700">
                  <p>PDF加载失败</p>
                </div>
              </div>
            }
          >
            {/* 渲染所有页面 */}
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} className="mb-4">
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-xl border-2 border-amber-200/50"
                  width={undefined}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer

