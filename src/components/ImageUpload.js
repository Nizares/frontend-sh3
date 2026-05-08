// components/ImageUpload.jsx
"use client"
import { useState, useRef } from "react"
import { PhotoIcon } from "@heroicons/react/24/outline"

export default function ImageUpload({ id = "cover_photo", label = "Cover photo", required = false }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return
    if (file.size > 10 * 1024 * 1024) return alert("File maksimal 10MB")

    const reader = new FileReader()
    reader.onload = (e) => setPreview({ url: e.target.result, name: file.name, size: file.size })
    reader.readAsDataURL(file)
  }

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xl font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      <input
        ref={inputRef}
        type="file"
        id={id}
        name={id}
        accept="image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {!preview ? (
        <div
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-2 cursor-pointer transition
            ${isDragging ? "border-text-colors bg-indigo-50" : "border-text-colors hover:border-text-colors hover:bg-gray-50"}`}
        >
          {/* Icon */}
          <PhotoIcon className="w-9 h-9"/>

          <p className="text-sm text-text-colors">
            <span className="text-orange-400 font-medium">Upload a file</span> or drag and drop
          </p>
          <p className="text-xs text-text-colors">PNG, JPG, GIF up to 10MB</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
          <img src={preview.url} alt="preview" className="w-11 h-11 rounded-md object-cover border border-gray-200 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{preview.name}</p>
            <p className="text-xs text-gray-400">{formatSize(preview.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="text-text-colors hover:text-red-500 p-1 rounded transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}