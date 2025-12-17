import React, { useRef, useState } from 'react'

function FileUpload({ onFileUpload, loading }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    const allowedTypes = ['.pdf', '.docx', '.txt']
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('请上传 PDF、DOCX 或 TXT 格式的文件')
      return
    }

    onFileUpload(file)
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-amber-600 bg-amber-100/80'
            : 'border-amber-400 bg-amber-50/60 hover:border-amber-500 hover:bg-amber-100/70'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} paper-texture ink-blur`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!loading ? onButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          disabled={loading}
        />

        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-700 mb-4"></div>
            <p className="text-lg text-amber-800">正在处理文档，请稍候...</p>
          </div>
        ) : (
          <>
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl font-semibold text-amber-900 mb-2">
              拖拽文件到此处或点击上传
            </p>
            <p className="text-sm text-amber-700">
              支持 PDF、DOCX、TXT 格式
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default FileUpload

