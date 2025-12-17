import React, { useMemo, useState } from 'react'

function MindMap({ data, onNodeClick }) {
  const [hoveredNode, setHoveredNode] = useState(null)
  const [clickedNode, setClickedNode] = useState(null)

  const treeData = useMemo(() => {
    if (!data) return null

    // 调试：打印接收到的数据
    console.log('MindMap received data:', data)

    const convertToTreeFormat = (node, depth = 0) => {
      // 如果node是null或undefined，返回null
      if (!node || typeof node !== 'object') {
        console.warn('Invalid node:', node)
        return null
      }

      // 检查是否有name字段
      if (!node.name) {
        console.error('节点缺少name字段:', node)
        // 如果整个数据对象都没有name，可能是数据格式错误
        if (depth === 0) {
          console.error('根节点缺少name字段，原始数据:', data)
        }
      }

      // 截断过长的文本，确保简洁
      let nodeName = node.name || `未命名节点-${depth}`
      // 如果文本过长，截断并添加省略号
      const maxLength = depth === 0 ? 30 : depth === 1 ? 20 : 15
      if (nodeName.length > maxLength) {
        nodeName = nodeName.substring(0, maxLength) + '...'
      }

    const result = {
        name: nodeName,
        keywords: node.keywords || [], // 保留关键词信息
        attributes: {},
        children: []
      }

      if (node.children && Array.isArray(node.children) && node.children.length > 0) {
        result.children = node.children
          .map(child => convertToTreeFormat(child, depth + 1))
          .filter(child => child !== null) // 过滤掉无效的节点
      }

      return result
    }

    const converted = convertToTreeFormat(data)
    console.log('Converted tree data:', converted)
    return converted
  }, [data])

  // 获取节点唯一标识
  const getNodeId = (node, level, index) => `node-${level}-${index}-${node.name}`

  const renderNode = (node, level = 0, parentX = 0, parentY = 0, index = 0, siblingCount = 1) => {
    const nodeId = getNodeId(node, level, index)
    const isHovered = hoveredNode === nodeId
    const isClicked = clickedNode === nodeId

    // 简洁的层级配色方案 - 层级越深颜色越浅
    // 简洁的层级样式配置 - 层级越深，颜色越浅，缩进越大
    const getLevelStyle = (level) => {
      if (level === 0) {
        return {
          bg: 'bg-amber-900',
          text: 'text-amber-50',
          border: 'border-amber-800',
          fontSize: 'text-2xl',
          padding: 'px-6 py-3',
          fontWeight: 'font-bold',
          indent: 0,
          lineWidth: 'w-1',
          lineColor: 'bg-amber-700',
          marginBottom: 'mb-6'
        }
      } else if (level === 1) {
        return {
          bg: 'bg-amber-800',
          text: 'text-amber-50',
          border: 'border-amber-700',
          fontSize: 'text-xl',
          padding: 'px-5 py-2.5',
          fontWeight: 'font-semibold',
          indent: 64,
          lineWidth: 'w-0.5',
          lineColor: 'bg-amber-600',
          marginBottom: 'mb-4'
        }
      } else if (level === 2) {
        return {
          bg: 'bg-amber-700',
          text: 'text-amber-50',
          border: 'border-amber-600',
          fontSize: 'text-lg',
          padding: 'px-4 py-2',
          fontWeight: 'font-medium',
          indent: 128,
          lineWidth: 'w-0.5',
          lineColor: 'bg-amber-500',
          marginBottom: 'mb-3'
        }
      } else {
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-900',
          border: 'border-amber-300',
          fontSize: 'text-base',
          padding: 'px-4 py-1.5',
          fontWeight: 'font-normal',
          indent: 192 + (level - 3) * 48,
          lineWidth: 'w-0.5',
          lineColor: 'bg-amber-400',
          marginBottom: 'mb-2'
        }
      }
    }
    
    const style = getLevelStyle(level)
    const indent = style.indent

    // 计算连接线的位置
    const connectorX = level === 0 ? 24 : (indent - 32)
    
    return (
      <div
        key={nodeId}
        className={`relative ${style.marginBottom}`}
      >
        {/* 节点卡片 - 简洁优雅的设计 */}
        <div
          className={`
            inline-block relative z-10
            ${style.bg} ${style.text}
            ${style.fontSize} ${style.fontWeight}
            ${style.padding}
            border ${style.border}
            rounded-lg
            shadow-sm
            transition-all duration-200 ease-out
            ${isHovered ? 'shadow-lg scale-[1.02] -translate-y-0.5' : ''}
            ${isClicked ? 'ring-2 ring-amber-400 ring-opacity-60' : ''}
            hover:shadow-md hover:scale-[1.01]
            cursor-pointer select-none
            break-words
            max-w-md
          `}
          style={{ marginLeft: `${indent}px` }}
          title={node.name}
          onMouseEnter={() => setHoveredNode(nodeId)}
          onMouseLeave={() => setHoveredNode(null)}
          onClick={() => {
            setClickedNode(nodeId)
            setTimeout(() => setClickedNode(null), 300)
            if (onNodeClick && node.keywords && node.keywords.length > 0) {
              onNodeClick(node.keywords)
            }
          }}
        >
          {/* 节点文本 */}
          <span className="whitespace-normal leading-relaxed">
            {node.name}
          </span>
        </div>

        {/* 子节点容器 */}
        {node.children && node.children.length > 0 && (
          <div className="relative mt-5">
            {/* 从父节点底部到子节点组的垂直连接线 */}
            <div
              className={`absolute ${style.lineColor}`}
              style={{ 
                left: `${connectorX}px`,
                top: '-24px',
                width: style.lineWidth === 'w-1' ? '2px' : '1px',
                height: '24px'
              }}
            ></div>

            {/* 子节点列表 */}
            <div className="space-y-4">
              {node.children.map((child, idx) => {
                const childStyle = getLevelStyle(level + 1)
                const isLast = idx === node.children.length - 1
                const childConnectorX = childStyle.indent - 32
                
                return (
                  <div key={idx} className="relative">
                    {/* 从垂直线到子节点的横向连接线 */}
                    <div
                      className={`absolute ${style.lineColor}`}
                      style={{ 
                        left: `${connectorX}px`,
                        top: '50%',
                        width: `${childConnectorX - connectorX + 12}px`,
                        height: style.lineWidth === 'w-1' ? '2px' : '1px',
                        transform: 'translateY(-50%)'
                      }}
                    ></div>
                    
                    {/* 连接所有子节点的垂直连接线（除了最后一个） */}
                    {!isLast && (
                      <div
                        className={`absolute ${style.lineColor}`}
                        style={{ 
                          left: `${connectorX}px`,
                          top: '50%',
                          width: style.lineWidth === 'w-1' ? '2px' : '1px',
                          bottom: '-16px'
                        }}
                      ></div>
                    )}
                    
                    {/* 连接点 - 更明显的连接点 */}
                    <div
                      className={`absolute ${style.lineColor} rounded-full border-2 border-amber-50`}
                      style={{ 
                        left: `${connectorX}px`,
                        top: '50%',
                        width: '8px',
                        height: '8px',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                    
                    {renderNode(child, level + 1, 0, 0, idx, node.children.length)}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!treeData) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50 paper-texture">
        <div className="text-center animate-fadeIn">
          <div className="text-7xl mb-6 animate-bounce">🗺️</div>
          <p className="text-xl font-semibold text-amber-900 mb-2">思维导图将显示在这里</p>
          <p className="text-sm text-amber-700">AI分析完成后，思维导图将自动生成</p>
          <div className="mt-8 flex gap-2 justify-center">
            <div className="w-2 h-2 bg-amber-700 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // 检查数据是否有效
  if (!treeData.name || treeData.name === '未命名节点') {
    console.warn('思维导图数据无效:', treeData)
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50 paper-texture">
        <div className="text-center animate-fadeIn">
          <div className="text-7xl mb-6">⚠️</div>
          <p className="text-xl font-semibold text-amber-900 mb-2">思维导图数据格式错误</p>
          <p className="text-sm text-amber-700 mb-4">请检查浏览器控制台的错误信息</p>
          <div className="max-w-md mx-auto p-4 bg-amber-50/80 backdrop-blur-sm rounded-lg border-2 border-amber-200">
            <p className="text-xs text-amber-900 font-mono">
              {JSON.stringify(treeData).substring(0, 100)}...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full overflow-auto bg-amber-50/30 p-6 paper-texture">
      <div className="relative max-w-5xl mx-auto">
        {/* 思维导图容器 - 简洁优雅的背景 */}
        <div className="relative bg-amber-50/90 rounded-lg shadow-sm p-10 border border-amber-200/60">
          <div className="text-left">
            {renderNode(treeData, 0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MindMap

