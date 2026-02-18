/**
 * 文件上传组件
 */
import { View, Image, Text } from '@tarojs/components'
import { FC, useState } from 'react'
import Taro from '@tarojs/taro'
import { FILE_UPLOAD_LIMIT } from '@/utils/constants'
import './UploadFile.scss'

interface FileItem {
  id: string
  url: string
  name: string
  type: 'image' | 'pdf'
  uploading?: boolean
}

interface UploadFileProps {
  files: FileItem[]
  onChange: (files: FileItem[]) => void
  maxCount?: number
}

const UploadFile: FC<UploadFileProps> = ({
  files,
  onChange,
  maxCount = FILE_UPLOAD_LIMIT.maxCount
}) => {
  const [uploading, setUploading] = useState(false)

  const handleChooseImage = async () => {
    if (files.length >= maxCount) {
      Taro.showToast({
        title: `最多上传${maxCount}个文件`,
        icon: 'none'
      })
      return
    }

    try {
      const result = await Taro.chooseImage({
        count: maxCount - files.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      setUploading(true)

      // 模拟上传
      for (const tempFilePath of result.tempFiles) {
        // 检查文件大小
        const fileInfo = await Taro.getFileInfo({ filePath: tempFilePath.path || tempFilePath as any })
        if (fileInfo.size > FILE_UPLOAD_LIMIT.maxSize) {
          Taro.showToast({
            title: '文件大小不能超过2MB',
            icon: 'none'
          })
          continue
        }

        // 模拟上传成功
        const newFile: FileItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: tempFilePath.path || tempFilePath as any,
          name: `附件${files.length + 1}`,
          type: 'image'
        }

        onChange([...files, newFile])
      }

      setUploading(false)
    } catch (error) {
      setUploading(false)
      console.error('选择图片失败:', error)
    }
  }

  const handleRemove = (id: string) => {
    onChange(files.filter(file => file.id !== id))
  }

  const handlePreview = (url: string) => {
    Taro.previewImage({
      current: url,
      urls: files.filter(f => f.type === 'image').map(f => f.url)
    })
  }

  return (
    <View className="upload-file">
      <View className="upload-file__list">
        {files.map(file => (
          <View key={file.id} className="upload-file__item">
            {file.type === 'image' ? (
              <Image
                src={file.url}
                mode="aspectFill"
                className="upload-file__image"
                onClick={() => handlePreview(file.url)}
              />
            ) : (
              <View className="upload-file__pdf">
                <Text className="upload-file__pdf-icon">📄</Text>
                <Text className="upload-file__pdf-name">{file.name}</Text>
              </View>
            )}
            <View className="upload-file__remove" onClick={() => handleRemove(file.id)}>
              ✕
            </View>
          </View>
        ))}
        {files.length < maxCount && (
          <View className="upload-file__add" onClick={handleChooseImage}>
            {uploading ? (
              <Text className="upload-file__add-text">上传中...</Text>
            ) : (
              <>
                <Text className="upload-file__add-icon">+</Text>
                <Text className="upload-file__add-text">上传附件</Text>
              </>
            )}
          </View>
        )}
      </View>
      <Text className="upload-file__tip">
        支持图片和PDF文件，单个文件不超过2MB，最多{maxCount}个
      </Text>
    </View>
  )
}

export default UploadFile
