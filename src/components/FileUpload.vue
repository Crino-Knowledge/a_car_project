<template>
  <div class="file-upload">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :action="uploadUrl"
      :auto-upload="false"
      :limit="limit"
      :accept="accept"
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      list-type="picture-card"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <div class="upload-tip">
      支持 {{ acceptText }} 格式，单个文件不超过 {{ maxSizeMB }}MB，最多 {{ limit }} 个文件
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElUpload, UploadFile, UploadFiles, UploadInstance } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadFile } from '@/api/upload'
import { validateFileSize, validateFileType } from '@/utils/validator'
import { showToast } from '@/utils/notification'

const props = withDefaults(defineProps<{
  modelValue: string[]
  limit?: number
  accept?: string
  maxSizeMB?: number
}>(), {
  limit: 3,
  accept: '.jpg,.jpeg,.png,.pdf',
  maxSizeMB: 2
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadFile[]>([])
const uploadUrl = '' // 使用自定义上传

const acceptText = computed(() => {
  return props.accept.split(',').map(ext => ext.replace('.', '').toUpperCase()).join(' / ')
})

// 监听外部值变化
watch(() => props.modelValue, (urls) => {
  if (urls && urls.length > 0) {
    fileList.value = urls.map((url, index) => ({
      name: url.split('/').pop() || `file-${index}`,
      url,
      status: 'success'
    } as UploadFile))
  }
}, { immediate: true })

// 文件变化处理
async function handleFileChange(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  if (!uploadFile.raw) return

  // 校验文件大小
  if (!validateFileSize(uploadFile.raw, props.maxSizeMB)) {
    showToast(`文件大小不能超过 ${props.maxSizeMB}MB`, 'error')
    fileList.value = fileList.value.filter(f => f.uid !== uploadFile.uid)
    return
  }

  // 校验文件类型
  const allowedTypes = props.accept.split(',')
  if (!validateFileType(uploadFile.raw, allowedTypes)) {
    showToast(`只支持 ${acceptText.value} 格式`, 'error')
    fileList.value = fileList.value.filter(f => f.uid !== uploadFile.uid)
    return
  }

  // 上传文件
  try {
    uploadFile.status = 'uploading'
    const res = await uploadFile(uploadFile.raw)
    if (res.code === 0 && res.data) {
      uploadFile.status = 'success'
      uploadFile.url = res.data.url
      updateModelValue()
      showToast('上传成功', 'success')
    } else {
      throw new Error(res.msg)
    }
  } catch (error: any) {
    uploadFile.status = 'fail'
    fileList.value = fileList.value.filter(f => f.uid !== uploadFile.uid)
    showToast(error.message || '上传失败', 'error')
  }
}

// 删除文件
function handleFileRemove(uploadFile: UploadFile) {
  fileList.value = fileList.value.filter(f => f.uid !== uploadFile.uid)
  updateModelValue()
}

// 超出限制
function handleExceed() {
  showToast(`最多只能上传 ${props.limit} 个文件`, 'warning')
}

// 上传前校验
function beforeUpload(file: File) {
  return false // 禁用自动上传，使用手动上传
}

// 更新外部值
function updateModelValue() {
  const urls = fileList.value
    .filter(f => f.status === 'success' && f.url)
    .map(f => f.url as string)
  emit('update:modelValue', urls)
}
</script>

<style lang="scss" scoped>
.file-upload {
  .upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: $text-secondary;
  }
}
</style>
